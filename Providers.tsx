import React, { PropsWithChildren } from "react";
import { WagmiProvider } from "wagmi";
import { anvil } from "@wagmi/core/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit, AppKit } from "@reown/appkit-wagmi-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { projectId, config as wagmiConfig } from "./wagmi.config";
import ErrorBoundary from "./ErrorBoundary";

const queryClient = new QueryClient();

createAppKit({
  projectId,
  wagmiConfig,
  defaultChain: anvil,
  enableAnalytics: true,
});

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ErrorBoundary>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView>{children}</GestureHandlerRootView>
          <AppKit />
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  );
}
