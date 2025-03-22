import { COMMENTS_V1_ADDRESS, CommentsV1Abi } from "@ecp.eth/sdk";
import { CommentData } from "@ecp.eth/sdk/schemas";
import { Hex } from "viem";
import { writeContract } from "@wagmi/core";
import { config } from "../wagmi.config";

type PostCommentViaContractParams = {
  commentData: CommentData;
  appSignature: Hex;
};

export const postCommentAsAuthorViaCommentsV1 = async ({
  appSignature,
  commentData,
}: PostCommentViaContractParams) => {
  return await writeContract(config, {
    abi: CommentsV1Abi,
    functionName: "postCommentAsAuthor",
    address: COMMENTS_V1_ADDRESS,
    args: [commentData, appSignature],
  });
};
