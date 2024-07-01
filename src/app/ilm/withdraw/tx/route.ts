import { NextResponse } from "next/server";
import { Abi, encodeFunctionData } from "viem";
import { SEAMLESS_ILM_ADDRESS } from "@/utils";
import { frames } from "./tx";
import { transaction } from "frames.js/core";
import { ethers } from "ethers";
import { SEAMLESS_ABI } from "./contracts/seamless";

const handleRequest = frames(async (ctx) => {
  if (!ctx?.message?.inputText) {
    console.log("No input text");
    return NextResponse.error();
  }

  if (!ctx.message?.connectedAddress) {
    console.log("No connected address");
    return NextResponse.error();
  }

  // Use ethers to pase the amount
  const amount = ethers.parseEther(ctx.message.inputText);

  console.log("Amount", amount.toString());

  const calldata = encodeFunctionData({
    abi: SEAMLESS_ABI,
    functionName: "redeem",
    args: [
      amount,
      ctx.message?.connectedAddress,
      ctx.message?.connectedAddress,
    ],
  });

  console.log("Calldata", calldata);
  return transaction({
    chainId: "eip155:8453",
    method: "eth_sendTransaction",
    attribution: false,
    params: {
      abi: SEAMLESS_ABI as Abi,
      to: SEAMLESS_ILM_ADDRESS,
      data: calldata,
      value: amount.toString(),
    },
  });
});

export const GET = handleRequest;
export const POST = handleRequest;
