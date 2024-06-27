/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./seamless";
import { IMAGE_URL, VERCEL_URL } from "@/utils";

const handleRequest = frames(async (ctx) => {
  return {
    image: IMAGE_URL,
    imageOptions: {
      aspectRatio: "1:1",
    },
    textInput: "How much USDC to lend?",
    buttons: [
      <Button
        action="tx"
        target={`${VERCEL_URL}/seamless/approve`}
        post_url="/lend"
      >
        Approve USDC
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
