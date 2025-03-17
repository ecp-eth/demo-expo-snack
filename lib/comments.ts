import { bigintReplacer } from "./utils";
import { fetchAPI } from "./fetch";
import {
  SignCommentRequestBodySchemaType,
  SignCommentResponseSchema,
} from "./schemas";
import { postCommentAsAuthorViaCommentsV1 } from "./contracts";
import { waitForTransactionReceipt } from "@wagmi/core";
import { chain, config } from "../wagmi.config";

const chainId = chain.id;

export const postComment = async (
  comment: SignCommentRequestBodySchemaType
) => {
  const signed = await fetchAPI(
    "/api/sign-comment",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comment, bigintReplacer),
    },
    SignCommentResponseSchema
  );

  const { data: commentData, signature: appSignature } = signed;

  const txHash = await postCommentAsAuthorViaCommentsV1({
    commentData,
    appSignature,
  });

  console.log("transaction sent", txHash);

  const receipt = await waitForTransactionReceipt(config, {
    hash: txHash,
    chainId,
  });

  console.log("transaction confirmed", receipt);

  return receipt;
};
