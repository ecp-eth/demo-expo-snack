import React from "react";
import {
  IndexerAPICommentSchemaType,
  IndexerAPICommentWithRepliesSchemaType,
} from "@ecp.eth/sdk/schemas";
import { View, Text } from "react-native";
import useEnrichedAuthor from "../hooks/useEnrichedAuthor";
import { AuthorBox } from "./AuthorBox";
import { AuthorLinker } from "./AuthorLinker";
import TimeBox from "./TimeBox";
import CommentBottomBar from "./CommentBottomBar";

type CommentProps = {
  comment: IndexerAPICommentSchemaType | IndexerAPICommentWithRepliesSchemaType;
  onReply?: (comment: IndexerAPICommentSchemaType) => void;
  onViewReplies?: (comment: IndexerAPICommentSchemaType) => void;
};

export const Comment = ({ comment, onReply, onViewReplies }: CommentProps) => {
  const author = useEnrichedAuthor(comment.author);
  const isRootComment = !!onViewReplies;
  return (
    <View
      style={{
        padding: 10,
        borderStartWidth: 1,
        borderStartColor: "#ccc",
        marginVertical: 10,
        gap: 15,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
        }}
      >
        <AuthorLinker author={author}>
          <AuthorBox author={author} />
        </AuthorLinker>

        <TimeBox timestamp={comment.timestamp} />
      </View>
      <Text>{comment.content}</Text>
      {isRootComment && (
        <CommentBottomBar
          comment={comment}
          onReply={onReply}
          onViewReplies={onViewReplies}
        />
      )}
    </View>
  );
};
