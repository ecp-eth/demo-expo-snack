import React from "react";
import {
  IndexerAPICommentSchemaType,
  IndexerAPICommentWithRepliesSchemaType,
} from "@ecp.eth/sdk/schemas";
import AntDesign from "@expo/vector-icons/AntDesign";
import { View, Text } from "react-native";
import useEnrichedAuthor from "../hooks/useEnrichedAuthor";
import { AuthorBox } from "./AuthorBox";
import { AuthorLinker } from "./AuthorLinker";
import TimeBox from "./TimeBox";
import CommentBottomBar from "./CommentBottomBar";

export const Comment = ({
  comment,
  onReply,
}: {
  comment: IndexerAPICommentSchemaType | IndexerAPICommentWithRepliesSchemaType;
  onReply: (comment: IndexerAPICommentSchemaType) => void;
}) => {
  const author = useEnrichedAuthor(comment.author);
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
      <CommentBottomBar comment={comment} onReply={onReply} />
    </View>
  );
};
