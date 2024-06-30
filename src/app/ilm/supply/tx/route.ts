import { NextResponse } from "next/server";
import { Abi, encodeFunctionData } from "viem";
import { WRAPPER_ADDRESS } from "@/utils";
import { frames } from "./tx";
import { transaction } from "frames.js/core";
import { ethers } from "ethers";
import { WRAPPER_ABI } from "./contracts/wrapper";

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
    abi: WRAPPER_ABI,
    functionName: "supply",
    args: [],
  });

  console.log("Calldata", calldata);
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
