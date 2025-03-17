import { useAccount, useSwitchChain } from "wagmi";
import Container from "../ui/Container";
import TextArea from "../ui/TextArea";
import { AccountButton, ConnectButton } from "@reown/appkit-wagmi-react-native";
import Button from "../ui/Button";
import { publicEnv } from "../env";
import { useState } from "react";
import { usePostComment } from "../hooks/usePostComment";
import { chain } from "../wagmi.config";
import { View } from "react-native";
import CurrentNetwork from "../components/CurrentNetwork";
import CommentSection from "../components/CommentSection";

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
    <Container>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <CurrentNetwork />
        <AccountButton />
      </View>
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

            console.log("switching chain...");

            await switchChainAsync({
              chainId,
            });

            console.log("posting comments...");

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
      <CommentSection />
    </Container>
  );
}
