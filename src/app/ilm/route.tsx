/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./ilm";
import {
  IMAGE_URL,
  STRATEGY_ADDRESS,
  useFetchStrategyApy,
  VERCEL_URL,
} from "@/utils";

const handleRequest = frames(async (ctx) => {
  let strategyAPY = 0;
  try {
    const strategyAPYRes = await useFetchStrategyApy(STRATEGY_ADDRESS);
    console.log("strategyAPY", strategyAPY);
    strategyAPY = strategyAPYRes.data.value.toFixed(2);
  } catch (e) {
    console.error(e);
  }

  let buttons = [
    <Button action="tx" target={`${VERCEL_URL}/ilm/supply/tx`} post_url="/">
      Supply ETH
    </Button>,
    <Button action="tx" target={`${VERCEL_URL}/ilm/withdraw/tx`} post_url="/">
      Withdraw wstETH
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

  // Let's construct an image with the current APY

  return {
    image: (
      <div
        tw="relative flex justify-center items-end w-full h-full text-black"
        style={{
          backgroundImage: `url('${IMAGE_URL}')`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div tw="absolute bottom-4 text-6xl flex p-4 rounded-lg shadow-lg transform transition duration-500 ease-in-out hover:scale-105 hover:shadow-2xl">
          {strategyAPY}% APY with wstETH Boost
        </div>
      </div>
    ),
    imageOptions: {
      aspectRatio: "1.91:1",
    },
    textInput: "How much wstETH?",
    buttons: buttons,
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
