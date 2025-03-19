import React from "react";
import { fetchComments } from "@ecp.eth/sdk";
import { useQuery } from "@tanstack/react-query";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { publicEnv } from "../env";
import { Comment } from "./Comment";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default () => {
  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments"],
    queryFn: () => {
      return fetchComments({
        apiUrl: publicEnv.EXPO_PUBLIC_INDEXER_URL,
        targetUri: publicEnv.EXPO_PUBLIC_TARGET_URI,
      });
    },
    enabled: true,
  });

  if (isLoading) {
    return (
      <CommentSectionContainer>
        <ActivityIndicator />
      </CommentSectionContainer>
    );
  }

  if (!comments?.results?.length) {
    return (
      <CommentSectionContainer>
        <Text>No comments yet</Text>
      </CommentSectionContainer>
    );
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={{
        flex: 1,
      }}
    >
      <CommentSectionContainer>
        {comments.results.map((comment) => {
          return <Comment key={comment.id} comment={comment} />;
        })}
      </CommentSectionContainer>
    </ScrollView>
  );
};

const CommentSectionContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingHorizontal: 30,
        paddingBottom: insets.bottom,
      }}
    >
      {children}
    </View>
  );
};
