import React, { useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useAccount, useSwitchChain } from "wagmi";
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
import useKeyboardRemainingheight from "../hooks/useKeyboardRemainingHeight";
import theme from "../theme";
import { ScrollView } from "react-native-gesture-handler";
import ApplyFadeToScrollable from "./ApplyFadeToScrollable";
import useWaitConnected from "../hooks/useWaitConnected";

const chainId = chain.id;
const TOTAL_COMMENT_AREA_PERCENTAGE = 0.5;
const HAS_REPLY_TEXT_TEXTAREA_PERCENTAGE = 0.2;
const HAS_REPLY_TEXT_COMMENT_CONTENT_PERCENTAGE = 0.1;
const lineHeight = 14 * 1.2;

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
  const isReplying = !!replyingComment;

  const waitConnected = useWaitConnected();
  const textAreaRef = useRef<TextInput>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [text, setText] = useState("");
  const { switchChainAsync } = useSwitchChain();
  const keyboardRemainingHeight = useKeyboardRemainingheight(
    isReplying
      ? HAS_REPLY_TEXT_TEXTAREA_PERCENTAGE
      : TOTAL_COMMENT_AREA_PERCENTAGE
  );

  const {
    mutateAsync: postComment,
    isPending: isPostingComment,
    error,
    reset,
  } = usePostComment();
  const { insertPendingCommentOperation } = useOptimisticCommentingManager(
    isReplying ? ["replies", replyingComment?.id] : ["comments"]
  );
  const textIsEmpty = !text || text.trim().length === 0;
  const disabledSubmit = textIsEmpty || isPostingComment || isProcessing;

  useShowErrorInToast(error);

  useAppForegroundedEffect(
    useCallback(() => {
      if (isPostingComment || !error) {
        // user returned without error and is still posting (could bew still signing)
        // probably the wallet hangs we reset state to allow they to try again
        reset();
        setIsProcessing(false);
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
        editable={!isProcessing}
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

      <Button
        disabled={disabledSubmit}
        loading={isPostingComment}
        onPress={async () => {
          if (textIsEmpty) {
            return;
          }

          const isReplying = !!replyingComment;
          setIsProcessing(true);

          try {
            console.log("connecting async...");

            const address = await waitConnected();

            console.log("switching chain...");

            await switchChainAsync({
              chainId,
            });

            console.log("switched, address:", address);

            if (!address) {
              throw new Error("Address not found");
            }

            console.log("start posting comment...");

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

            if (isReplying && !justViewingReplies) {
              onCancelReply();
            }
          } finally {
            setIsProcessing(false);
          }
        }}
      >
        {isReplying ? "Post reply" : "Post comment"}
      </Button>
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
  const replyingCommentContentHeight = useKeyboardRemainingheight(
    HAS_REPLY_TEXT_COMMENT_CONTENT_PERCENTAGE
  );
  return (
    <View
      style={{
        borderLeftWidth: 2,
        borderColor: theme.colors.reply,
        paddingStart: 10,
        maxHeight:
          Math.ceil(
            Math.min(
              replyingCommentContentHeight,
              Dimensions.get("window").height * 0.3
            ) / lineHeight
          ) * lineHeight,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <ApplyFadeToScrollable
        style={{ flex: 1, flexShrink: 1 }}
        fadingPercentage={0.7}
      >
        <ScrollView>
          <Text>{comment.content}</Text>
        </ScrollView>
      </ApplyFadeToScrollable>

      <TouchableOpacity onPress={onClose} style={{ marginStart: 10 }}>
        <Ionicons name="close-circle" size={24} color={theme.colors.reply} />
      </TouchableOpacity>
    </View>
  );
}
