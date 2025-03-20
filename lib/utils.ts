import { z } from "zod";
import { publicEnv } from "../env";
import { AuthorType } from "./types";

export function formatAuthorLink(author: AuthorType): string | null {
  if (!publicEnv.EXPO_PUBLIC_COMMENT_AUTHOR_URL) {
    return null;
  }

  const url = publicEnv.EXPO_PUBLIC_COMMENT_AUTHOR_URL.replace(
    "{address}",
    author.address
  );

  return z.string().url().safeParse(url).success ? url : null;
}
