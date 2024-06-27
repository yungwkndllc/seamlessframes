import { NextResponse } from "next/server";
import { Abi, encodeFunctionData } from "viem";
import { USDC_ADDRESS, SEAMLESS_ADDRESS } from "@/utils";
import { frames } from "./tx";
import { transaction } from "frames.js/core";
import { ethers } from "ethers";
import { SEAMLESS_ABI } from "./contracts/seamless";

const handleRequest = frames(async (ctx) => {
  // Get the query param of amount
  const amountFromQuery = ctx.searchParams.amount;

  if (!ctx.message?.connectedAddress) {
    return NextResponse.error();
  }

  // Use ethers to pase the amount
  const amount = ethers.parseUnits(amountFromQuery, 6);

  const calldata = encodeFunctionData({
    abi: SEAMLESS_ABI,
    functionName: "supply",
    args: [USDC_ADDRESS, amount, ctx.message?.connectedAddress, 0],
  });

  return transaction({
    chainId: "eip155:8453",
    method: "eth_sendTransaction",
    attribution: false,
    params: {
      abi: SEAMLESS_ABI as Abi,
      to: SEAMLESS_ADDRESS,
      data: calldata,
    },
  });
});

export const GET = handleRequest;
export const POST = handleRequest;
