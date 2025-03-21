import React, { useCallback, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useAccount, useSwitchChain } from "wagmi";
import { ConnectButton } from "@reown/appkit-wagmi-react-native";
import { IndexerAPICommentSchemaType } from "@ecp.eth/sdk/schemas";
import Ionicons from "@expo/vector-icons/Ionicons";
import TextArea from "../ui/TextArea";
import Button from "../ui/Button";
import { publicEnv } from "../env";
import { useState } from "react";
import { usePostComment } from "../hooks/usePostComment";
import { chain } from "../wagmi.config";
import { useOptimisticCommentingManager } from "../hooks/useOptimisticCommentingManager";
import useShowErrorInToast from "../hooks/useShowErrorInToast";
import useAppForegroundedEffect from "../hooks/useAppForegroundedEffect";
import { truncateText } from "../lib/utils";
import {
  TRUNCATE_COMMENT_LENGTH,
  TRUNCATE_COMMENT_LINES,
} from "../lib/constants";
import useKeyboardRemainingheight from "../hooks/useKeyboardRemainingHeight";

const chainId = chain.id;

type CommentFormProps = {
  replyTo?: IndexerAPICommentSchemaType;
  onCancelReply: () => void;
};

export default function CommentForm({
  replyTo,
  onCancelReply,
}: CommentFormProps) {
  const { address } = useAccount();
  const textAreaRef = useRef<TextInput>(null);
  const [textAreaDisabled, setTextAreaDisabled] = useState(false);
  const [text, setText] = useState("");
  const { switchChainAsync } = useSwitchChain();
  const keyboardRemainingHeight = useKeyboardRemainingheight(
    !!replyTo ? 0.2 : 0.5
  );

  const {
    mutateAsync: postComment,
    isPending: isPostingComment,
    error,
    reset,
  } = usePostComment();
  const { insertPendingCommentOperation } = useOptimisticCommentingManager([
    "comments",
  ]);
  const textIsEmpty = !text || text.trim().length === 0;
  const disabledSubmit = textIsEmpty || isPostingComment;

  useShowErrorInToast(error);

  useAppForegroundedEffect(
    useCallback(() => {
      if (isPostingComment || !error) {
        // user returned without error and is still posting (could bew still signing)
        // probably the wallet hangs we reset state to allow they to try again
        reset();
        setTextAreaDisabled(false);
      }
    }, [])
  );

  useEffect(() => {
    if (!replyTo) {
      return;
    }
    textAreaRef.current?.focus();
  }, [replyTo]);

  return (
    <View style={{ gap: 20 }}>
      {replyTo && <ReplyToComment comment={replyTo} onClose={onCancelReply} />}

      <TextArea
        editable={!textAreaDisabled}
        value={text}
        placeholder={
          !!replyTo ? "Write a reply here..." : "Write a comment here..."
        }
        onChangeText={setText}
        style={{
          maxHeight: keyboardRemainingHeight,
        }}
        ref={textAreaRef}
      />

      {address ? (
        <Button
          disabled={disabledSubmit}
          loading={isPostingComment}
          onPress={async () => {
            if (textIsEmpty) {
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
                  parentId: replyTo?.id,
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

              if (!!replyTo) {
                onCancelReply();
              }
            } finally {
              setTextAreaDisabled(false);
            }
          }}
        >
          {!!replyTo ? "Post reply" : "Post comment"}
        </Button>
      ) : null}
      {!address ? (
        <ConnectButton label="Connect" loadingLabel="Connecting..." />
      ) : null}
    </View>
  );
}

type ReplyToCommentProps = {
  comment: IndexerAPICommentSchemaType;
  onClose: () => void;
};

function ReplyToComment({ comment, onClose }: ReplyToCommentProps) {
  const keyboardRemainingHeight = useKeyboardRemainingheight(0.3);
  return (
    <View
      style={{
        borderLeftWidth: 2,
        borderColor: "#64B5F6",
        paddingStart: 10,
        maxHeight: keyboardRemainingHeight,

        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View style={{ flex: 1, flexShrink: 1 }}>
        <Text>
          {truncateText(
            comment.content,
            TRUNCATE_COMMENT_LENGTH,
            TRUNCATE_COMMENT_LINES
          )}
        </Text>
      </View>
      <TouchableOpacity onPress={onClose} style={{ marginStart: 10 }}>
        <Ionicons name="close-circle" size={24} color="#64B5F6" />
      </TouchableOpacity>
    </View>
  );
}
