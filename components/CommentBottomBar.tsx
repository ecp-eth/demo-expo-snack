import {
  IndexerAPICommentSchemaType,
  IndexerAPICommentWithRepliesSchemaType,
} from "@ecp.eth/sdk/schemas";
import AntDesign from "@expo/vector-icons/AntDesign";
import { View, Text } from "react-native";

export default ({
  comment,
}: {
  comment: IndexerAPICommentSchemaType | IndexerAPICommentWithRepliesSchemaType;
}) => {
  const hasReplies = isIndexerAPICommentWithRepliesSchemaType(comment);
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: hasReplies ? "space-between" : "flex-end",
        alignItems: "center",
        gap: 10,
      }}
    >
      {hasReplies && (
        <Text>
          {comment.replies.results.length}{" "}
          {comment.replies.results.length > 1 ? "Replies" : "Reply"}
        </Text>
      )}

      <AntDesign name="message1" size={20} color="black" />
    </View>
  );
};

function isIndexerAPICommentWithRepliesSchemaType(
  comment: IndexerAPICommentSchemaType | IndexerAPICommentWithRepliesSchemaType
): comment is IndexerAPICommentWithRepliesSchemaType {
  return (
    "replies" in comment &&
    comment.replies &&
    comment.replies.results.length > 0
  );
}
