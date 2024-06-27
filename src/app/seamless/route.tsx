/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./seamless";
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
    textInput: "How much USDC would you like to lend?",
    buttons: [
      <Button
        action="tx"
        target={`${VERCEL_URL}/seamless/txdata?amount=1`}
        post_url="/seamless"
      >
        Approve USDC
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
