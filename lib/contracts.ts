import {
  COMMENTS_V1_ADDRESS,
  CommentsV1Abi,
  createCommentSuffixData,
} from "@ecp.eth/sdk/dist/index";
import { CommentData } from "@ecp.eth/sdk/dist/schemas";
import { Hex, parseAbi } from "viem";
import { publicEnv } from "../env";
import { writeContract } from "@wagmi/core";
import { config } from "../wagmi.config";

type PostCommentViaContractParams = {
  commentData: CommentData;
  appSignature: Hex;
};

export const postCommentViaYoink = async ({
  appSignature,
  commentData,
}: PostCommentViaContractParams) => {
  const commentDataSuffix = createCommentSuffixData({
    commentData,
    appSignature,
  });

  return await writeContract(config, {
    abi: parseAbi(["function yoink()"]),
    functionName: "yoink",
    address: publicEnv.EXPO_PUBLIC_YOINK_CONTRACT_ADDRESS,
    dataSuffix: commentDataSuffix,
  });
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
