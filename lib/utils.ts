import { publicEnv } from "../env";
import { formatAuthorLinkWithTemplate } from "@ecp.eth/shared/helpers";
import { AuthorType } from "@ecp.eth/shared/types";

export function formatAuthorLink(author: AuthorType): string | null {
  return formatAuthorLinkWithTemplate(
    author,
    publicEnv.EXPO_PUBLIC_COMMENT_AUTHOR_URL
  );
}
