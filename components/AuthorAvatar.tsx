import React from "react";
import { View, Image } from "react-native";
import { blo } from "blo";
import useEnrichedAuthor from "../hooks/useEnrichedAuthor";
import { AuthorType } from "../lib/types";
import { getCommentAuthorNameOrAddress } from "../lib/utils";

const AVATAR_SIZE = 24;

type AuthorAvatarProps = {
  author: AuthorType;
};

export function AuthorAvatar({ author }: AuthorAvatarProps) {
  const enrichedAuthor = useEnrichedAuthor(author);
  const nameOrAddress = getCommentAuthorNameOrAddress(enrichedAuthor);
  const avatarUrl =
    enrichedAuthor.ens?.avatarUrl ??
    enrichedAuthor.farcaster?.pfpUrl ??
    blo(author.address);

  return (
    <View
      style={{
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        overflow: "hidden",
      }}
    >
      <Image
        source={{ uri: avatarUrl }}
        style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
        resizeMode="cover"
        alt={nameOrAddress}
      />
    </View>
  );
}
