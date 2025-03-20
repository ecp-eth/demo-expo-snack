import { publicEnv } from "../env";
import { formatAuthorLinkWithTemplate } from "@ecp.eth/shared/helpers";
import { AuthorType } from "@ecp.eth/shared/types";

export function formatAuthorLink(author: AuthorType): string | null {
  return formatAuthorLinkWithTemplate(
    author,
    publicEnv.EXPO_PUBLIC_COMMENT_AUTHOR_URL
  );
}

/**
 * Truncate text for reply preview
 *
 * @param text
 * @param maxLength
 * @returns
 */
export function truncateText(
  text: string,
  maxLength: number,
  maxLines: number
): string {
  const splitByNewline = text.split("\n");
  let truncated = text;

  if (splitByNewline.length > maxLines) {
    truncated =
      splitByNewline.slice(0, maxLines).filter(Boolean).join("\n") + "...";
  }

  if (truncated.length <= maxLength) {
    return truncated;
  }

  return truncated.slice(0, maxLength).trim() + "...";
}
