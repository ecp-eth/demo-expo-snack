import React, { useCallback } from "react";
import { View } from "react-native";
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
import useShowErrorInToast from "../hooks/useShowErrorInToast";
import useAppForegroundedEffect from "../hooks/useAppForegroundedEffect";

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
    reset,
  } = usePostComment();
  const { insertPendingCommentOperation } = useOptimisticCommentingManager([
    "comments",
  ]);
  const disabledSubmit = !text || isPostingComment;

  useShowErrorInToast(error);

  useAppForegroundedEffect(
    useCallback(() => {
      if (isPostingComment || !error) {
        // user might have connnectivity issue with the wallet
        // so we reset the error and the posting state
        reset();
      }
    }, [])
  );

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
