import React, { PropsWithChildren, useMemo } from "react";
import { TouchableOpacity, Linking } from "react-native";
import { AuthorType } from "../lib/types";
import { formatAuthorLink } from "../lib/utils";

export function AuthorLinker({
  children,
  author,
}: PropsWithChildren<{
  author: AuthorType;
}>) {
  const authorLink = useMemo(() => formatAuthorLink(author), [author]);

  if (!authorLink) {
    return <>{children}</>;
  }

  return (
    <TouchableOpacity onPress={() => Linking.openURL(authorLink)}>
      {children}
    </TouchableOpacity>
  );
}
