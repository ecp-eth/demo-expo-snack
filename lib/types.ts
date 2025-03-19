import {
  IndexerAPICommentSchemaType,
  IndexerAPICommentWithRepliesSchemaType,
} from "@ecp.eth/sdk/schemas";

type CommentType =
  | IndexerAPICommentSchemaType
  | IndexerAPICommentWithRepliesSchemaType;

export type AuthorType = CommentType["author"];
