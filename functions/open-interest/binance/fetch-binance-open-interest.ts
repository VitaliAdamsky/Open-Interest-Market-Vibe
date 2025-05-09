// deno-lint-ignore-file no-explicit-any no-explicit-any no-explicit-any

import { Coin } from "../../../grant-utils/models/coin.ts";
import { TF } from "../../../grant-utils/models/timeframes.ts";
import { FetchResult } from "../../../models/fetch-result.ts";
import { fetchBinanceOiData } from "./fetch-binance-oi-data.ts";

// Main function to fetch Binance OI data
export const fetchBinanceOpenInterest = async (
  coins: Coin[],
  timeframe: TF,
  limit: number
) => {
  const promises = coins.map((coin) =>
    fetchBinanceOiData(coin, timeframe, limit)
  );

  // Use setTimeout with delay 0 to relieve CPU
  await setTimeout(() => {}, 0);

  const results = await Promise.all(promises);

  const successfulResults = results.filter((result: any) => result.success);

  const failedResults = results.filter((result: any) => !result.success);

  const successfulSymbols: string[] = successfulResults.map(
    (result: any) => result.symbol
  );

  const failedSymbols: string[] = failedResults.map(
    (result: any) => result.symbol
  );

  return {
    successfulResults,
    successfulSymbols,
    failedResults,
    failedSymbols,
  } as FetchResult;
};
