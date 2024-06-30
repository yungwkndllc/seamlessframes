/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./ilm";
import { IMAGE_URL, VERCEL_URL } from "@/utils";

const handleRequest = frames(async (ctx) => {
  let buttons = [
    <Button action="tx" target={`${VERCEL_URL}/ilm/supply/tx`} post_url="/">
      Supply ETH
    </Button>,
  ];

  if (ctx.message?.transactionId) {
    buttons.push(
      <Button
        action="link"
        target={`https://app.seamlessprotocol.com/#/?asset=0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452-0x4200000000000000000000000000000000000006&tab=My+Positions`}
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
