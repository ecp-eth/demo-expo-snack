import {
  IndexerAPICommentSchemaType,
  IndexerAPICommentWithRepliesSchemaType,
} from "@ecp.eth/sdk/schemas";
import AntDesign from "@expo/vector-icons/AntDesign";
import { View, Text, TouchableOpacity } from "react-native";
import theme from "../theme";
import LinkButton from "../ui/LinkButton";

type CommentBottomBarProps = {
  comment: IndexerAPICommentSchemaType | IndexerAPICommentWithRepliesSchemaType;
  onReply?: (comment: IndexerAPICommentSchemaType) => void;
  onViewReplies: (comment: IndexerAPICommentSchemaType) => void;
};

export default function CommentBottomBar({
  comment,
  onReply,
  onViewReplies,
}: CommentBottomBarProps) {
  const hasReplies = isIndexerAPICommentWithRepliesSchemaType(comment);
  // FIXME: there is no field to tell us the total number of replies
  const replyCount = hasReplies ? comment.replies.pagination.limit : 0;
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
        <LinkButton onPress={() => onViewReplies(comment)}>
          {replyCount > 1 ? "View Replies" : "View Reply"}
        </LinkButton>
      )}

      {onReply && (
        <TouchableOpacity onPress={() => onReply(comment)}>
          <AntDesign name="message1" size={20} color="black" />
        </TouchableOpacity>
      )}
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
