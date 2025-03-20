import React from "react";
import { IndexerAPICommentSchemaType } from "@ecp.eth/sdk/schemas";
import { View, Text } from "react-native";
import useEnrichedAuthor from "../hooks/useEnrichedAuthor";
import { AuthorBox } from "./AuthorBox";
import { AuthorLinker } from "./AuthorLinker";

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
        <AuthorLinker author={author}>
          <AuthorBox author={author} />
        </AuthorLinker>
      </View>
      <Text>{comment.content}</Text>
    </View>
  );
};
