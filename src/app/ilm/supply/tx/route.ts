import { NextResponse } from "next/server";
import { Abi, encodeFunctionData } from "viem";
import { SEAMLESS_ILM_ADDRESS } from "@/utils";
import { frames } from "./tx";
import { transaction } from "frames.js/core";
import { ethers } from "ethers";
import { SEAMLESS_ABI } from "./contracts/seamless";

const ALCHEMY_PROVIDER =
  "https://base-mainnet.g.alchemy.com/v2/HTer3r6Wwb-OGCxI2j6p8p28mLA0wYHX";

const handleRequest = frames(async (ctx) => {
  // Get the query param of amount
  const amountFromQuery = ctx.searchParams.amount;

  if (!ctx.message?.connectedAddress) {
    return NextResponse.error();
  }

  // Use ethers to pase the amount
  const amount = ethers.parseEther(amountFromQuery);

  // Have to ask onchain to convert to shares
  const contract = new ethers.Contract(
    SEAMLESS_ILM_ADDRESS,
    SEAMLESS_ABI,
    new ethers.JsonRpcProvider(ALCHEMY_PROVIDER)
  );

  // Convert to shares
  const shares = await contract.convertToShares(amount);

  const calldata = encodeFunctionData({
    abi: SEAMLESS_ABI,
    functionName: "deposit",
    args: [amount, ctx.message?.connectedAddress, shares],
  });

  return transaction({
    chainId: "eip155:8453",
    method: "eth_sendTransaction",
    attribution: false,
    params: {
      abi: SEAMLESS_ABI as Abi,
      to: SEAMLESS_ILM_ADDRESS,
      data: calldata,
    },
  });
});

export const GET = handleRequest;
export const POST = handleRequest;
