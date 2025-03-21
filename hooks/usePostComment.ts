import { postComment } from "../lib/comments";
import { SignCommentPayloadRequestSchemaType } from "../lib/generated/schemas";
import { useMutation } from "@tanstack/react-query";

export const usePostComment = () => {
  return useMutation({
    mutationFn: (comment: SignCommentPayloadRequestSchemaType) => {
      return postComment(comment);
    },
  });
};
