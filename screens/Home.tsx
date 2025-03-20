import React, { useState } from "react";
import { View } from "react-native";
import { IndexerAPICommentSchemaType } from "@ecp.eth/sdk/schemas";
import Container from "../ui/Container";
import CommentSection from "../components/CommentSection";
import StatusBar from "../components/StatusBar";

import CommentForm from "../components/CommentForm";

export default function Home() {
  const [replyToComment, setReplyToComment] =
    useState<IndexerAPICommentSchemaType>();

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Container>
        <StatusBar />
        <CommentForm
          replyTo={replyToComment}
          onCancelReply={() => setReplyToComment(undefined)}
        />
      </Container>
      <CommentSection
        onReply={(replyToComment) => setReplyToComment(replyToComment)}
      />
    </View>
  );
}
