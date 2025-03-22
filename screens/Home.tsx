import React, { useState } from "react";
import { View } from "react-native";
import { IndexerAPICommentSchemaType } from "@ecp.eth/sdk/schemas";
import CommentSection from "../components/CommentSection";
import StatusBar from "../components/StatusBar";
import CommentForm from "../components/CommentForm";
import WhiteFadingGradient from "../ui/WhiteFadingGradient";

export default function Home() {
  const [replyToComment, setReplyToComment] =
    useState<IndexerAPICommentSchemaType>();

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          paddingTop: 30,
        }}
      >
        <View
          style={{
            position: "relative",
            paddingHorizontal: 30,
            gap: 20,
          }}
        >
          <StatusBar />
          <CommentForm
            replyTo={replyToComment}
            onCancelReply={() => setReplyToComment(undefined)}
          />
          <WhiteFadingGradient />
        </View>
      </View>
      <CommentSection
        onReply={(replyToComment) => setReplyToComment(replyToComment)}
      />
    </View>
  );
}
