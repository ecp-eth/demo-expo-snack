import { useCallback, useRef, useState } from "react";
import { useAccountEffect } from "wagmi";
import Deferred from "promise-deferred";
import { Hex } from "viem";
import { useAppKit } from "@reown/appkit-wagmi-react-native";
import useAppForegroundedEffect from "./useAppForegroundedEffect";

export default function useWaitConnected() {
  const [address, setAddress] = useState<Hex>();
  const { open } = useAppKit();
  const waitConnectedPromise = useRef<Deferred<Hex>>();
  const waitAppForegroundPromise = useRef<Deferred<void>>();

  useAppForegroundedEffect(() => {
    waitAppForegroundPromise.current?.resolve();
  });

  useAccountEffect({
    onConnect(data) {
      if (waitConnectedPromise.current) {
        waitConnectedPromise.current.resolve(data.address);
      }
    },
    onDisconnect() {
      setAddress(undefined);
    },
  });

  return useCallback(async () => {
    if (address) {
      return address;
    }

    open();

    const walletConnectedDeferred = (waitConnectedPromise.current =
      new Deferred());

    const appForegroundedDeferred = (waitAppForegroundPromise.current =
      new Deferred());

    await appForegroundedDeferred.promise;

    const addr = await walletConnectedDeferred.promise;

    appForegroundedDeferred.current = undefined;
    waitConnectedPromise.current = undefined;
    setAddress(addr);

    return addr;
  }, []);
}
