import { NextResponse } from "next/server";
import { Abi, encodeFunctionData } from "viem";
import { USDC_ABI } from "./contracts/seamless";
import { WSETH_ADDRESS, SEAMLESS_ILM_ADDRESS } from "@/utils";
import { frames } from "./approve";
import { transaction } from "frames.js/core";
import { ethers } from "ethers";

const handleRequest = frames(async (ctx) => {
  // Get the query param of message
  if (!ctx.message?.inputText) {
    return NextResponse.error();
  }

  // Use ethers to pase the amount
  const amount = ethers.parseEther(ctx.message.inputText);

  const calldata = encodeFunctionData({
    abi: USDC_ABI,
    functionName: "approve",
    args: [SEAMLESS_ILM_ADDRESS, amount],
  });

  return transaction({
    chainId: "eip155:8453",
    method: "eth_sendTransaction",
    attribution: false,
    params: {
      abi: USDC_ABI as Abi,
      to: WSETH_ADDRESS,
      data: calldata,
    },
  });
});

export const GET = handleRequest;
export const POST = handleRequest;
