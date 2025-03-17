import { anvil, base } from "@wagmi/core/chains";
import { defaultWagmiConfig } from "@reown/appkit-wagmi-react-native";
import { publicEnv } from "./env";
import { http } from "wagmi";

const metadata = {
  name: "Ethereum Comments Protocol - React Native Demo",
  description: "A demo of the Ethereum Comments Protocol on React Native",
  url: "https://demo.ethcomments.xyz",
  icons: ["https://docs.ethcomments.xyz/logo-light.svg"],
  redirect: {
    native: "ECP_RN_DEMO://",
    universal: "rn.demo.ethcomments.xyz",
  },
};

export const chain = publicEnv.NODE_ENV === "production" ? base : anvil;
export const projectId = publicEnv.EXPO_PUBLIC_REOWN_APP_ID;
export const transport = http(publicEnv.EXPO_PUBLIC_RPC_URL);

export const config = defaultWagmiConfig({
  chains: [chain],
  transports: {
    [chain.id]: transport,
  },
  projectId,
  metadata,
});
