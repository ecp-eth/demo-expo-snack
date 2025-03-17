import { postComment } from "../lib/comments";
import { SignCommentRequestBodySchemaType } from "../lib/schemas";
import { useMutation } from "@tanstack/react-query";

export const usePostComment = () => {
  return useMutation({
    mutationFn: (comment: SignCommentRequestBodySchemaType) => {
      return postComment(comment);
    },
  });
};
