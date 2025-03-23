import React, { useState } from "react";
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
import {
  TRUNCATE_COMMENT_LENGTH,
  TRUNCATE_COMMENT_LINES,
} from "../lib/constants";
import { truncateText } from "../lib/utils";
import Link from "../ui/Link";
import LinkButton from "../ui/LinkButton";

type CommentProps = {
  comment: IndexerAPICommentSchemaType | IndexerAPICommentWithRepliesSchemaType;
  onReply?: (comment: IndexerAPICommentSchemaType) => void;
  onViewReplies?: (comment: IndexerAPICommentSchemaType) => void;
};

export const Comment = ({ comment, onReply, onViewReplies }: CommentProps) => {
  const [showMore, setShowMore] = useState(false);
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
      {comment.content.length < TRUNCATE_COMMENT_LENGTH || showMore ? (
        <Text>{comment.content}</Text>
      ) : (
        <>
          <Text>
            {truncateText(
              comment.content,
              TRUNCATE_COMMENT_LENGTH,
              TRUNCATE_COMMENT_LINES
            )}
          </Text>
          <LinkButton
            onPress={() => {
              setShowMore(true);
            }}
          >
            Show full comment
          </LinkButton>
        </>
      )}
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
