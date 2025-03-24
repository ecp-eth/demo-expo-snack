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
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Hex } from "viem";
import { IndexerAPICommentSchemaType } from "@ecp.eth/sdk/schemas";
import { publicEnv } from "../env";
import { Comment } from "./Comment";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RepliesSection from "./RepliesSection";
import ApplyFadeToScrollable from "./ApplyFadeToScrollable";
import { COMMENT_BOX_AVERAGE_HEIGHT } from "../lib/constants";

type CommentSectionProps = {
  onReply: (comment: IndexerAPICommentSchemaType) => void;
  onViewReplies: (comment: IndexerAPICommentSchemaType) => void;
  onCloseViewReplies: () => void;
  replyingComment: IndexerAPICommentSchemaType | undefined;
};

export default function CommentSection({
  onReply,
  onViewReplies,
  onCloseViewReplies,
  replyingComment,
}: CommentSectionProps) {
  const insets = useSafeAreaInsets();
  const { repliesSectionAnimatedStyle, handleCloseReplies, handleViewReplies } =
    useRepliesAnimation(onViewReplies, onCloseViewReplies);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["comments"],
      initialPageParam: {
        cursor: undefined as Hex | undefined,
        // assuming comment box minimal height is 120, we want to at least fetch enough
        // to fill the screen
        // cursor: pageParam,
        limit: Math.ceil(
          Dimensions.get("window").height / COMMENT_BOX_AVERAGE_HEIGHT
        ),
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

  if (allComments.length <= 0) {
    return (
      <CommentSectionContainer>
        <Text>No comments yet</Text>
      </CommentSectionContainer>
    );
  }

  return (
    <CommentSectionContainer disablePaddingVertical={true}>
      <ApplyFadeToScrollable>
        <FlatList
          keyboardShouldPersistTaps="handled"
          data={allComments}
          renderItem={({ item }) => (
            <Comment
              comment={item}
              onReply={onReply}
              onViewReplies={handleViewReplies}
            />
          )}
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
            paddingBottom: insets.bottom,
          }}
        />
      </ApplyFadeToScrollable>
      <RepliesSection
        parentComment={replyingComment}
        animatedStyle={repliesSectionAnimatedStyle}
        onClose={handleCloseReplies}
      />
    </CommentSectionContainer>
  );
}

const useRepliesAnimation = (
  onViewReplies: (comment: IndexerAPICommentSchemaType) => void,
  onCloseViewReplies: () => void
) => {
  const repliesLeft = useSharedValue<`${number}%`>("100%");
  const repliesSectionAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: repliesLeft.value }],
    };
  });
  const handleViewReplies = (comment: IndexerAPICommentSchemaType) => {
    onViewReplies(comment);
    repliesLeft.value = withTiming("0%", {
      duration: 200,
    });
  };
  const handleCloseReplies = () => {
    onCloseViewReplies();
    repliesLeft.value = withTiming("100%", {
      duration: 200,
    });
  };

  return {
    repliesSectionAnimatedStyle,
    handleViewReplies,
    handleCloseReplies,
  };
};

export const CommentSectionContainer = ({
  children,
  disablePaddingVertical = false,
}: {
  children: React.ReactNode;
  disablePaddingVertical?: boolean;
}) => {
  return (
    <View
      style={{
        flex: 1,
        paddingTop: disablePaddingVertical ? 0 : 30,
        paddingHorizontal: 30,
      }}
    >
      <View style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {children}
      </View>
    </View>
  );
};
