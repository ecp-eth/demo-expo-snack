import { AuthorType } from "./types";

/**
 * Used in JSON.stringify top replaces all bigint values with their string representation
 * @param key
 * @param value
 * @returns
 */
export function bigintReplacer(_: string, value: unknown) {
  if (typeof value === "bigint") {
    return value.toString();
  }
  return value;
}

export function getCommentAuthorNameOrAddress(author: AuthorType): string {
  return (
    author.ens?.name ??
    author.farcaster?.displayName ??
    abbreviateAddressForDisplay(author.address)
  );
}

export function abbreviateAddressForDisplay(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
