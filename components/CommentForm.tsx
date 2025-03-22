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
import theme from "../theme";

const chainId = chain.id;

type CommentFormProps = {
  justViewingReplies?: boolean;
  replyingComment?: IndexerAPICommentSchemaType;
  onCancelReply: () => void;
};

export default function CommentForm({
  justViewingReplies,
  replyingComment,
  onCancelReply,
}: CommentFormProps) {
  const { address } = useAccount();
  const textAreaRef = useRef<TextInput>(null);
  const [textAreaDisabled, setTextAreaDisabled] = useState(false);
  const [text, setText] = useState("");
  const { switchChainAsync } = useSwitchChain();
  const keyboardRemainingHeight = useKeyboardRemainingheight(
    !!replyingComment ? 0.2 : 0.5
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
    if (justViewingReplies) {
      return;
    }

    if (!replyingComment) {
      return;
    }
    textAreaRef.current?.focus();
  }, [replyingComment, justViewingReplies]);

  return (
    <View style={{ gap: 20 }}>
      {replyingComment && (
        <ReplyToComment
          comment={replyingComment}
          onClose={onCancelReply}
          justViewingReplies={justViewingReplies}
        />
      )}

      <TextArea
        editable={!textAreaDisabled}
        value={text}
        placeholder={
          !!replyingComment
            ? "Write a reply here..."
            : "Write a comment here..."
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
                  parentId: replyingComment?.id,
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

              if (!!replyingComment) {
                onCancelReply();
              }
            } finally {
              setTextAreaDisabled(false);
            }
          }}
        >
          {!!replyingComment ? "Post reply" : "Post comment"}
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
  justViewingReplies?: boolean;
};

function ReplyToComment({
  comment,
  onClose,
  justViewingReplies,
}: ReplyToCommentProps) {
  const keyboardRemainingHeight = useKeyboardRemainingheight(0.3);
  return (
    <View
      style={{
        borderLeftWidth: 2,
        borderColor: theme.colors.reply,
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
      {!justViewingReplies && (
        <TouchableOpacity onPress={onClose} style={{ marginStart: 10 }}>
          <Ionicons name="close-circle" size={24} color={theme.colors.reply} />
        </TouchableOpacity>
      )}
    </View>
  );
}
