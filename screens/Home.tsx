import React, { useEffect } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { useAccount, useSwitchChain } from "wagmi";
import { ConnectButton } from "@reown/appkit-wagmi-react-native";
import Container from "../ui/Container";
import TextArea from "../ui/TextArea";
import Button from "../ui/Button";
import { publicEnv } from "../env";
import { useState } from "react";
import { usePostComment } from "../hooks/usePostComment";
import { chain } from "../wagmi.config";
import CommentSection from "../components/CommentSection";
import StatusBar from "../components/StatusBar";
import { useOptimisticCommentingManager } from "../hooks/useOptimisticCommentingManager";
import {
  NetworkError,
  RateLimitError,
  ResponseError,
  ResponseSchemaError,
} from "../lib/errors";

const chainId = chain.id;

export default function Home() {
  const { address } = useAccount();
  const [textAreaDisabled, setTextAreaDisabled] = useState(false);
  const [text, setText] = useState("");
  const { switchChainAsync } = useSwitchChain();
  const {
    mutateAsync: postComment,
    isPending: isPostingComment,
    error,
  } = usePostComment();
  const { insertPendingCommentOperation } = useOptimisticCommentingManager([
    "comments",
  ]);
  const disabledSubmit = !text || isPostingComment;

  useEffect(() => {
    if (error == null) {
      return;
    }

    Toast.show({
      type: "error",
      text1: getErrorMessage(error),
    });
  }, [error]);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Container>
        <StatusBar />
        <TextArea
          editable={!textAreaDisabled}
          value={text}
          placeholder="Write a comment here..."
          onChangeText={setText}
        />
        {address ? (
          <Button
            disabled={disabledSubmit}
            loading={isPostingComment}
            onPress={async () => {
              if (!text) {
                return;
              }

              setTextAreaDisabled(true);

              try {
                await switchChainAsync({
                  chainId,
                });

                const { txHash, commentData, appSignature, commentId } =
                  await postComment({
                    content: text,
                    // in react native app we will have to specify a targetUri that is owned by us
                    targetUri: publicEnv.EXPO_PUBLIC_TARGET_URI,
                    author: address,
                    chainId,
                  });
                setText("");

                insertPendingCommentOperation({
                  chainId,
                  txHash: txHash,
                  response: {
                    data: { ...commentData, id: commentId },
                    signature: appSignature,
                    hash: commentId,
                  },
                });
              } finally {
                setTextAreaDisabled(false);
              }
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

function getErrorMessage(error: Error) {
  if (error instanceof NetworkError) {
    return "📡 There seems to be an issue with your network connection. Please try again later.";
  }

  if (error instanceof ResponseError) {
    return "🔧 Our servers are currently experiencing issues. Please try again later.";
  }

  if (error instanceof RateLimitError) {
    return "⏳ We've noticed you're quite active! Please wait a moment before trying again.";
  }

  if (error instanceof ResponseSchemaError) {
    return "🔧 There seems to be an issue with the data we received from the server. Please try upgrade the app or reach out to support.";
  }

  return "❌ " + error.message;
}
