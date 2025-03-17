import { IndexerAPICommentSchemaType } from "@ecp.eth/sdk/dist/schemas";
import React from "react";
import { View, Text } from "react-native";
import useEnrichedAuthor from "../hooks/useEnrichedAuthor";
import { AuthorBox } from "./AuthorBox";

export const Comment = ({
  comment,
}: {
  comment: IndexerAPICommentSchemaType;
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
      <View>
        <AuthorBox author={author} />
      </View>
      <Text>{comment.content}</Text>
    </View>
  );
};
