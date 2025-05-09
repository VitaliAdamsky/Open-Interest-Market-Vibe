import { Coin } from "../../../grant-utils/models/coin.ts";

import { fetchBybitOiData } from "./fetch-bybit-oi-data.ts";
import { FetchResult } from "../../../models/fetch-result.ts";
import { TF } from "../../../grant-utils/models/timeframes.ts";

// Main function to fetch Bybit OI data
export const fetchBybitOpenInterest = async (
  coins: Coin[],
  timeframe: TF,
  limit: number
) => {
  const promises = coins.map((coin) =>
    fetchBybitOiData(coin, timeframe, limit)
  );

  // Use setTimeout with delay 0 to relieve CPU
  await setTimeout(() => {}, 0);

  const results = await Promise.all(promises);

  const successfulResults = results.filter((result) => result.success);

  const failedResults = results.filter((result) => !result.success);

  const successfulSymbols = successfulResults.map((result) => result.symbol);
  const failedSymbols = failedResults.map((result) => result.symbol);

  return {
    successfulResults,
    successfulSymbols,
    failedResults,
    failedSymbols,
  } as FetchResult;
};
