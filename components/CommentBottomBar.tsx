import {
  IndexerAPICommentSchemaType,
  IndexerAPICommentWithRepliesSchemaType,
} from "@ecp.eth/sdk/schemas";
import AntDesign from "@expo/vector-icons/AntDesign";
import { View, Text, TouchableOpacity } from "react-native";

type CommentBottomBarProps = {
  comment: IndexerAPICommentSchemaType | IndexerAPICommentWithRepliesSchemaType;
  onReply: (comment: IndexerAPICommentSchemaType) => void;
};

export default function CommentBottomBar({
  comment,
  onReply,
}: CommentBottomBarProps) {
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

      <TouchableOpacity onPress={() => onReply(comment)}>
        <AntDesign name="message1" size={20} color="black" />
      </TouchableOpacity>
    </View>
  );
}

function isIndexerAPICommentWithRepliesSchemaType(
  comment: IndexerAPICommentSchemaType | IndexerAPICommentWithRepliesSchemaType
): comment is IndexerAPICommentWithRepliesSchemaType {
  return (
    "replies" in comment &&
    comment.replies &&
    comment.replies.results.length > 0
  );
}
