import React from "react";
import { fetchComments } from "@ecp.eth/sdk";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from "react-native";
import { Hex } from "viem";
import { IndexerAPICommentSchemaType } from "@ecp.eth/sdk/schemas";
import { publicEnv } from "../env";
import { Comment } from "./Comment";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type CommentSectionProps = {
  onReply: (comment: IndexerAPICommentSchemaType) => void;
};

export default function CommentSection({ onReply }: CommentSectionProps) {
  const insets = useSafeAreaInsets();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["comments"],
      initialPageParam: {
        cursor: undefined as Hex | undefined,
        // assuming comment box minimal height is 120, we want to at least fetch enough
        // to fill the screen
        // cursor: pageParam,
        limit: Math.ceil(Dimensions.get("window").height / 120),
      },
      queryFn: ({ pageParam, signal }) => {
        return fetchComments({
          apiUrl: publicEnv.EXPO_PUBLIC_INDEXER_URL,
          targetUri: publicEnv.EXPO_PUBLIC_TARGET_URI,
          appSigner: publicEnv.EXPO_PUBLIC_APP_SIGNER_ADDRESS,

          limit: pageParam.limit,
          cursor: pageParam.cursor,
          signal,
        });
      },
      getNextPageParam: (lastPage) => {
        if (!lastPage.pagination.hasNext) {
          return;
        }

        return {
          cursor: lastPage.pagination.endCursor,
          limit: lastPage.pagination.limit,
        };
      },
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: true,
    });

  if (isLoading) {
    return (
      <CommentSectionContainer>
        <ActivityIndicator />
      </CommentSectionContainer>
    );
  }

  const allComments = data?.pages.flatMap((page) => page.results) ?? [];

  if (!allComments.length) {
    return (
      <CommentSectionContainer>
        <Text>No comments yet</Text>
      </CommentSectionContainer>
    );
  }

  return (
    <FlatList
      keyboardShouldPersistTaps="handled"
      data={allComments}
      renderItem={({ item }) => <Comment comment={item} onReply={onReply} />}
      keyExtractor={(item) => item.id}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={() =>
        isFetchingNextPage ? <ActivityIndicator /> : null
      }
      contentContainerStyle={{
        paddingTop: 30,
        paddingHorizontal: 30,
        paddingBottom: insets.bottom,
      }}
    />
  );
}

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
