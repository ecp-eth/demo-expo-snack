import { useEffect } from "react";
import useAppForegrounded from "./useAppForegrounded";

export default (callback: () => void) => {
  const appForegrounded = useAppForegrounded();

  useEffect(() => {
    if (appForegrounded) {
      callback();
    }
  }, [appForegrounded]);
};
