import React from "react";
import { useAccount, useSwitchChain } from "wagmi";
import Container from "../ui/Container";
import TextArea from "../ui/TextArea";
import { ConnectButton } from "@reown/appkit-wagmi-react-native";
import Button from "../ui/Button";
import { publicEnv } from "../env";
import { useState } from "react";
import { usePostComment } from "../hooks/usePostComment";
import { chain } from "../wagmi.config";
import CommentSection from "../components/CommentSection";
import StatusBar from "../components/StatusBar";
import { View } from "react-native";

const chainId = chain.id;

export default function Home() {
  const { address } = useAccount();
  const [text, setText] = useState("");
  const { switchChainAsync } = useSwitchChain();
  const { mutate: postComment, isPending, error } = usePostComment();

  if (error) {
    throw error;
  }

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Container>
        <StatusBar />
        <TextArea
          value={text}
          placeholder="Write a comment here..."
          onChangeText={setText}
        />
        {address ? (
          <Button
            disabled={!text}
            loading={isPending}
            onPress={async () => {
              if (!text) {
                return;
              }

              await switchChainAsync({
                chainId,
              });

              await postComment({
                content: text,
                // in react native app we will have to specify a targetUri that is owned by us
                targetUri: publicEnv.EXPO_PUBLIC_TARGET_URI,
                author: address,
                chainId,
              });
            }}
          >
            Post comment
          </Button>
        ) : null}
        {!address ? (
          <ConnectButton label="Connect" loadingLabel="Connecting..." />
        ) : null}
      </Container>
      <CommentSection />
    </View>
  );
}
