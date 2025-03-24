import {
  IndexerAPICommentSchemaType,
  IndexerAPICommentWithRepliesSchemaType,
} from "@ecp.eth/sdk/schemas";
import AntDesign from "@expo/vector-icons/AntDesign";
import { View, TouchableOpacity } from "react-native";
import LinkButton from "../ui/LinkButton";
import { useAccount } from "wagmi";

type CommentBottomBarProps = {
  comment: IndexerAPICommentSchemaType | IndexerAPICommentWithRepliesSchemaType;
  onReply?: (comment: IndexerAPICommentSchemaType) => void;
  onViewReplies?: (comment: IndexerAPICommentSchemaType) => void;
  onDelete: (comment: IndexerAPICommentSchemaType) => void;
};

export default function CommentBottomBar({
  comment,
  onReply,
  onViewReplies,
  onDelete,
}: CommentBottomBarProps) {
  const { address: connectedAddress } = useAccount();
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
      {hasReplies && onViewReplies && (
        <LinkButton onPress={() => onViewReplies(comment)}>
          {replyCount > 1 ? "View Replies" : "View Reply"}
        </LinkButton>
      )}

      <View style={{ flexDirection: "row", gap: 30 }}>
        {comment.author.address.toLowerCase() ===
          connectedAddress?.toLowerCase() && (
          <TouchableOpacity onPress={() => onDelete(comment)} hitSlop={15}>
            <AntDesign name="delete" size={20} color="black" />
          </TouchableOpacity>
        )}

        {onReply && (
          <TouchableOpacity onPress={() => onReply(comment)} hitSlop={15}>
            <AntDesign name="message1" size={20} color="black" />
          </TouchableOpacity>
        )}
      </View>
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
