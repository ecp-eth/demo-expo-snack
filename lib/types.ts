import {
  IndexerAPICommentSchemaType,
  IndexerAPICommentWithRepliesSchemaType,
} from "@ecp.eth/sdk/dist/schemas";

type CommentType =
  | IndexerAPICommentSchemaType
  | IndexerAPICommentWithRepliesSchemaType;

export type AuthorType = CommentType["author"];
