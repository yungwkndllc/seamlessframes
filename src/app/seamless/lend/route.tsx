/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./lend";
import { IMAGE_URL, VERCEL_URL } from "@/utils";

const handleRequest = frames(async (ctx) => {
  let amountMessage = "";
  if (ctx?.message?.inputText) {
    amountMessage = `Lend ${ctx.message.inputText} USDC`;
  }

  return {
    image: IMAGE_URL,
    imageOptions: {
      aspectRatio: "1.91:1",
    },
    buttons: [
      <Button
        action="tx"
        target={{
          pathname: `/tx`,
          query: { amount: ctx?.message?.inputText },
        }}
        post_url={`${VERCEL_URL}/seamless`}
      >
        {amountMessage}
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
