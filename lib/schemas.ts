import { z } from "zod";
import { HexSchema } from "@ecp.eth/sdk/schemas";

export const abc = z.object({
  // signature: HexSchema,
  // hash: HexSchema,
  // data: CommentDataSchema,
});

export const SignCommentRequestBodySchema = z.object({
  // replace with following line to enable basic profanity detection
  content: z.string().trim().nonempty(),
  /* content: z
    .string()
    .trim()
    .nonempty()
    .refine((val) => {
      return !isProfane(val);
    }, "Comment contains profanity"), */
  targetUri: z.string().url(),
  parentId: HexSchema.optional(),
  chainId: z.number(),
  author: HexSchema,
});

export type SignCommentRequestBodySchemaType = z.infer<
  typeof SignCommentRequestBodySchema
>;
