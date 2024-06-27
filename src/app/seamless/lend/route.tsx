/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./lend";
import { IMAGE_URL, VERCEL_URL } from "@/utils";

const handleRequest = frames(async (ctx) => {
  if (ctx.message?.transactionId) {
    return {
      image: IMAGE_URL,
      imageOptions: {
        aspectRatio: "1:1",
      },
      buttons: [
        <Button
          action="link"
          target={`https://basescan.org/tx/${ctx.message.transactionId}`}
        >
          View on basescan
        </Button>,
      ],
    };
  }

  return {
    image: IMAGE_URL,
    imageOptions: {
      aspectRatio: "1:1",
    },
    textInput: "How much USDC to lend?",
    buttons: [
      <Button
        action="tx"
        target={`${VERCEL_URL}/seamless/lend/tx`}
        post_url="/seamless/lend"
      >
        Lend
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
