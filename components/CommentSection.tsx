import { fetchComments } from "@ecp.eth/sdk/dist";
import { useQuery } from "@tanstack/react-query";
import { View, Text, ActivityIndicator } from "react-native";
import { publicEnv } from "../env";
import Container from "../ui/Container";

export default () => {
  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments"],
    queryFn: () => {
      return fetchComments({
        targetUri: publicEnv.EXPO_PUBLIC_TARGET_URI,
      });
    },
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
    <CommentSectionContainer>
      {comments.results.map((comment) => {
        return (
          <View>
            <Text>{comment.author.address}</Text>
            <Text>{comment.content}</Text>
          </View>
        );
      })}
    </CommentSectionContainer>
  );
};

const CommentSectionContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <View>{children}</View>;
};
