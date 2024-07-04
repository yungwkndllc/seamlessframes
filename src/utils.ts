import { Address, erc20Abi, formatUnits } from "viem";
import { Config, createConfig, http, useBlock } from "wagmi";
import { readContract } from "wagmi/actions";
import { loopStrategyAbi } from "./abis";
import { base } from "viem/chains";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { UseQueryResult, QueryKey } from "@tanstack/react-query";

import { Abi, ContractFunctionArgs, ContractFunctionName } from "viem";
import {
  ResolvedRegister,
  UseReadContractParameters,
  useReadContract,
} from "wagmi";
import { ReadContractData } from "wagmi/query";

export const APY_BLOCK_FRAME =
  ((BigInt(60) * BigInt(60) * BigInt(24)) / BigInt(2)) * BigInt(30); // 30 days

export const IMAGE_URL =
  "https://arweave.net/VgkozyIoaTBWE7j_qiVskIUa2UfRIKc78A-F2Uu9XFY";
export const VERCEL_URL = "https://seamlessframes.vercel.app";

export const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
export const SEAMLESS_ADDRESS = "0x8F44Fd754285aa6A2b8B9B97739B79746e0475a7";
export const WSETH_ADDRESS = "0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452";
export const SEAMLESS_ILM_ADDRESS =
  "0x258730e23cF2f25887Cb962d32Bd10b878ea8a4e";

export const WRAPPER_ADDRESS = "0xC3812E7c09BE98eF892a0E190F5b62dAd3dfc92C";

export const STRATEGY_ADDRESS = "0xc82a728429f112e85c827c7c8734c9210c3cf8ea";
export const SECONDS_PER_YEAR = 60 * 60 * 24 * 365;
export const COMPOUNDING_PERIODS_APY = 1;
export const ONE_USD = BigInt(10 ** 8);
export const ONE_ETHER = BigInt(10 ** 18);

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

export interface StrategyAsset {
  underlying: Address;
  collateral: Address;
  debt: Address;
}

export const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(
      "https://base-mainnet.g.alchemy.com/v2/78Auxb3oCMIgLQ_-CMVzF6r69yKdUA9u"
    ),
  },
});

export const fetchAssetPriceInBlock = async (
  config: Config,
  asset?: Address,
  blockNumber?: bigint,
  underlyingAsset?: Address
): Promise<bigint | undefined> => {
  if (!asset) return undefined;

  let price = BigInt(0);

  const equityUsd = await readContract(config, {
    address: asset,
    abi: loopStrategyAbi,
    functionName: "equityUSD",
    blockNumber,
  });

  const totalSupply = await readContract(config, {
    address: asset,
    abi: erc20Abi,
    functionName: "totalSupply",
    blockNumber,
  });

  if (totalSupply !== BigInt(0)) {
    price = (equityUsd * ONE_ETHER) / totalSupply;
  }

  if (underlyingAsset) {
    const underlyingPrice = await fetchAssetPriceInBlock(
      config,
      underlyingAsset,
      blockNumber
    );

    if (!underlyingPrice) return undefined;

    price = (price * ONE_USD) / underlyingPrice;
  }

  return price;
};

export async function fetchStrategyApy(
  strategy: Address,
  latestBlockData?: any,
  prevBlockData?: any,
  strategyAssets?: StrategyAsset
): Promise<number | undefined> {
  if (
    latestBlockData == null ||
    prevBlockData == null ||
    strategyAssets == null
  )
    return undefined;

  const shareValueInLatestBlock = await fetchAssetPriceInBlock(
    config,
    strategy,
    latestBlockData?.number,
    strategyAssets?.debt
  );
  const shareValueInPrevBlock = await fetchAssetPriceInBlock(
    config,
    strategy,
    prevBlockData.number,
    strategyAssets?.debt
  );

  if (shareValueInLatestBlock == null || shareValueInPrevBlock == null)
    return undefined;

  const result = calculateApy(
    shareValueInLatestBlock,
    shareValueInPrevBlock,
    BigInt(latestBlockData.timestamp - prevBlockData.timestamp)
  );

  return result;
}

export const fetchStrategyApyQueryOptions = ({
  strategy,
  latestBlockData,
  prevBlockData,
  assetsData,
}: {
  strategy?: Address;
  latestBlockData?: any;
  prevBlockData?: any;
  assetsData?: StrategyAsset;
}) => {
  return queryOptions({
    queryKey: ["strategyApy", strategy],
    queryFn: () =>
      fetchStrategyApy(strategy!, latestBlockData, prevBlockData, assetsData),
    enabled: !!latestBlockData && !!prevBlockData && !!assetsData && !!strategy,
  });
};

export interface FetchNumber {
  value?: number;
  symbol?: string;
}

export interface FetchBigInt {
  bigIntValue?: bigint;
  decimals?: number;
  symbol?: string;
}

export type Fetch<T> = T & {
  isFetched: boolean;
  isLoading: boolean;
};

export type ExtendedQueryState<TData> = Pick<
  UseQueryResult<TData>,
  "isLoading" | "isFetched"
> & {
  queryKeys?: QueryKey[];
  queryKey?: QueryKey;
  isError?: boolean;
  isSuccess?: boolean;
};

export function mergeQueryStates<TData>(
  queryStates: ExtendedQueryState<TData>[]
): ExtendedQueryState<TData> {
  return queryStates.reduce<ExtendedQueryState<TData>>(
    (accumulator, current) => {
      return {
        isLoading: accumulator.isLoading || current.isLoading, // true if any is loading
        isError: accumulator.isError || current.isError, // true if any has error
        isFetched: accumulator.isFetched && current.isFetched, // true if all are fetched
        isSuccess: accumulator.isSuccess && current.isSuccess, // true if all are successful
        queryKeys: [
          ...(accumulator.queryKeys || []),
          ...(current.queryKeys || []),
          ...(current.queryKey ? [current.queryKey] : []),
        ],
      };
    },
    {
      isLoading: false,
      isError: false,
      isFetched: true,
      isSuccess: true,
      queryKeys: [],
    }
  );
}

export interface FetchData<T> extends ExtendedQueryState<T> {
  data: T;
}

export const metadataQueryConfig = {
  staleTime: Infinity,
};

export function useSeamlessContractRead<
  const TAbi extends Abi | readonly unknown[],
  TFunctionName extends ContractFunctionName<TAbi, "pure" | "view">,
  TArgs extends ContractFunctionArgs<TAbi, "pure" | "view", TFunctionName>,
  config extends Config = ResolvedRegister["config"],
  selectData = ReadContractData<TAbi, TFunctionName, TArgs>
>(
  parameters = {} as UseReadContractParameters<
    TAbi,
    TFunctionName,
    TArgs,
    config,
    selectData
  >
) {
  // ************* //
  // Read contract //
  // ************* //
  const result = useReadContract({ ...parameters });

  return {
    ...result,
  };
}

export const useFetchStrategyAssets = (strategy?: Address) => {
  return useSeamlessContractRead({
    address: strategy,
    abi: loopStrategyAbi,
    functionName: "getAssets",
    query: {
      ...metadataQueryConfig,
      enabled: !!strategy,
    },
  });
};

export const useFetchStrategyApy = async (strategy?: Address): Promise<any> => {
  const { data: latestBlockData, ...latestBlockRest } = useBlock();

  const enabled = !!latestBlockData?.number;
  const blockNumber = enabled
    ? latestBlockData.number - APY_BLOCK_FRAME
    : undefined;

  const { data: prevBlockData, ...prevBlockRest } = useBlock({
    query: { enabled },
    blockNumber,
  });

  const { data: strategyAssets, ...strategyAssetsRest } =
    useFetchStrategyAssets(strategy);

  const result = await fetchStrategyApyQueryOptions({
    strategy,
    latestBlockData,
    prevBlockData,
    assetsData: strategyAssets,
  });

  return {
    data: {
      value: result,
      symbol: "%",
    },
  };
};

export interface Displayable<T> extends ExtendedQueryState<T> {
  data: T;
}

export interface ViewValueSymbolPair {
  viewValue?: string | undefined;
  symbol?: string | undefined;
}

export interface ViewNumber extends ViewValueSymbolPair {
  value?: number | undefined;
}

export interface DecimalsOptions {
  singleDigitNumberDecimals: number;
  doubleDigitNumberDecimals: number;
  threeDigitNumberDecimals: number;
  fourDigitNumberDecimals: number;
}

function format(value: number, decimals: number) {
  const formatter = Intl.NumberFormat("en", {
    notation: "compact",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return formatter.format(value);
}

const defaultDecimalsOptions: DecimalsOptions = {
  singleDigitNumberDecimals: 2,
  doubleDigitNumberDecimals: 2,
  threeDigitNumberDecimals: 2,
  fourDigitNumberDecimals: 2,
};

export function formatToDisplayable(
  value: number | undefined,
  decimalsOptions: Partial<DecimalsOptions>
) {
  if (!value) return format(0, 2);

  const decimalsFormattingOptions = {
    ...defaultDecimalsOptions,
    ...decimalsOptions,
  };

  let decimals;
  if (value < 10) {
    decimals = decimalsFormattingOptions.singleDigitNumberDecimals;
  } else if (value < 99.5) {
    decimals = decimalsFormattingOptions.doubleDigitNumberDecimals;
  } else if (value < 1000) {
    decimals = decimalsFormattingOptions.threeDigitNumberDecimals;
  } else {
    decimals = decimalsFormattingOptions.fourDigitNumberDecimals;
  }

  return format(value, decimals);
}

export function formatFetchNumberToViewNumber(
  fetchNumber?: FetchNumber,
  decimalsOptions?: Partial<DecimalsOptions>
): ViewNumber {
  if (!fetchNumber)
    return {
      value: undefined,
      viewValue: "/",
      symbol: "/",
    };

  const decimalsFormattingOptions = {
    ...defaultDecimalsOptions,
    ...decimalsOptions,
  };
  return {
    value: fetchNumber.value,
    viewValue: formatToDisplayable(
      fetchNumber.value,
      decimalsFormattingOptions
    ),
    symbol: fetchNumber.symbol,
  };
}
