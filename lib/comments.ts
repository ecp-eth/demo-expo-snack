import { bigintReplacer } from "./utils";
import { fetchAPI } from "./fetch";
import { SignCommentRequestBodySchemaType, abc } from "./schemas";
import { throwResponseError, throwResponseSchemaError } from "./errors";

export const postComment = async (
  comment: SignCommentRequestBodySchemaType
) => {
  const signingResponse = await fetchAPI("/api/sign-comment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(comment, bigintReplacer),
  });

  if (!signingResponse.ok) {
    await throwResponseError(signingResponse);
  }

  const parsed = abc.safeParse(await signingResponse.json());

  // if (!parsed.success) {
  //   throwResponseSchemaError(parsed.error);
  // }

  // const { signature } = parsed.data;

  // console.log(signature);
};
