/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./ilm";
import { IMAGE_URL, VERCEL_URL } from "@/utils";

const handleRequest = frames(async (ctx) => {
  let buttons = [
    <Button action="tx" target={`${VERCEL_URL}/ilm/supply`} post_url="/lend">
      Supply wstETH
    </Button>,
  ];

  if (ctx.message?.transactionId) {
    buttons.push(
      <Button
        action="link"
        target={`https://app.seamlessprotocol.com/#/?asset=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913&tab=My+Positions`}
      >
        View your positions
      </Button>
    );
  }

  return {
    image: IMAGE_URL,
    imageOptions: {
      aspectRatio: "1.91:1",
    },
    textInput: "How much wstETH to supply?",
    buttons: buttons,
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
