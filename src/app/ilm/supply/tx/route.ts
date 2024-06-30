import { NextResponse } from "next/server";
import { Abi, encodeFunctionData } from "viem";
import { WRAPPER_ADDRESS } from "@/utils";
import { frames } from "./tx";
import { transaction } from "frames.js/core";
import { ethers } from "ethers";
import { WRAPPER_ABI } from "./contracts/wrapper";

const handleRequest = frames(async (ctx) => {
  let amountMessage = "";
  if (ctx?.message?.inputText) {
    amountMessage = `Supply ${ctx.message.inputText} wstETH`;
  } else {
    return NextResponse.error();
  }

  if (!ctx.message?.connectedAddress) {
    return NextResponse.error();
  }

  // Use ethers to pase the amount
  const amount = ethers.parseEther(ctx.message.inputText);

  const calldata = encodeFunctionData({
    abi: WRAPPER_ABI,
    functionName: "supply",
    args: [],
  });

  return transaction({
    chainId: "eip155:8453",
    method: "eth_sendTransaction",
    attribution: false,
    params: {
      abi: WRAPPER_ABI as Abi,
      to: WRAPPER_ADDRESS,
      data: calldata,
      value: ethers.formatEther(amount),
    },
  });
});

export const GET = handleRequest;
export const POST = handleRequest;
