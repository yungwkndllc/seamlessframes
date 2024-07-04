import { formatUnits } from "viem";

export const IMAGE_URL =
  "https://arweave.net/VgkozyIoaTBWE7j_qiVskIUa2UfRIKc78A-F2Uu9XFY";
export const VERCEL_URL = "https://seamlessframes.vercel.app";

export const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
export const SEAMLESS_ADDRESS = "0x8F44Fd754285aa6A2b8B9B97739B79746e0475a7";
export const WSETH_ADDRESS = "0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452";
export const SEAMLESS_ILM_ADDRESS =
  "0x258730e23cF2f25887Cb962d32Bd10b878ea8a4e";

export const WRAPPER_ADDRESS = "0xC3812E7c09BE98eF892a0E190F5b62dAd3dfc92C";

export const SECONDS_PER_YEAR = 60 * 60 * 24 * 365;
export const COMPOUNDING_PERIODS_APY = 1;

export function formatUnitsToNumber(
  value: string | bigint | undefined,
  decimals: number
) {
  return Number(formatUnits((value || 0) as bigint, decimals));
}

export function calculateApy(
  endValue: bigint,
  startValue: bigint,
  timeWindow: bigint
): number {
  if (
    startValue === BigInt(0) ||
    endValue === BigInt(0) ||
    timeWindow === BigInt(0)
  ) {
    return 0;
  }

  const endValueNumber = formatUnitsToNumber(endValue, 18);
  const startValueNumber = formatUnitsToNumber(startValue, 18);
  const timeWindowNumber = Number(timeWindow);

  const apr =
    (endValueNumber / startValueNumber) **
      (SECONDS_PER_YEAR / timeWindowNumber) -
    1;

  return (
    ((1 + apr / COMPOUNDING_PERIODS_APY) ** COMPOUNDING_PERIODS_APY - 1) * 100
  );
}
