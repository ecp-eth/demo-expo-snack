import { AuthorType } from "../lib/types";
import { getCommentAuthorNameOrAddress } from "../lib/utils";
import { View, Text } from "react-native";
import { AuthorAvatar } from "./AuthorAvatar";
import useEnrichedAuthor from "../hooks/useEnrichedAuthor";

type AuthorBoxProps = {
  author: AuthorType;
};

export function AuthorBox({ author }: AuthorBoxProps) {
  const enrichedAuthor = useEnrichedAuthor(author);
  const nameOrAddress = getCommentAuthorNameOrAddress(enrichedAuthor);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      }}
    >
      <AuthorAvatar author={enrichedAuthor} />
      <View>
        <Text>{nameOrAddress}</Text>
      </View>
    </View>
  );
}
