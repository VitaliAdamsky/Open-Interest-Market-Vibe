// deno-lint-ignore-file no-explicit-any

import { calculateCloseTime } from "../../../grant-utils/exchanges/utils/calculate-close-time.Ts";
import { getIntervalDurationMs } from "../../../grant-utils/exchanges/utils/get-interval-duration-ms.ts";
import { Coin } from "../../../grant-utils/models/coin.ts";
import { TF } from "../../../grant-utils/models/timeframes.ts";

import {
  OpenInterestData,
  OpenInterestItem,
} from "../../../models/open-interest-data.ts";

// Function to process the data for a single coin
export function processBinanceOpenInterestData(
  coin: Coin,
  rawEntries: any[],
  timeframe: TF
) {
  const intervalMs = getIntervalDurationMs(timeframe);

  // Sort the raw entries by timestamp in ascending order
  const sortedEntries = [...rawEntries].sort(
    (a, b) => a.timestamp - b.timestamp
  );

  // Process the sorted entries into OpenInterestItem objects
  const data = sortedEntries.map((entry: any, index: number) => {
    const openInterest = Number(entry.sumOpenInterestValue);
    let openInterestChange = 0;

    if (index > 0) {
      const previousOpenInterest = Number(
        sortedEntries[index - 1].sumOpenInterestValue
      );
      openInterestChange =
        ((openInterest - previousOpenInterest) /
          Math.abs(previousOpenInterest)) *
        100;
    }

    return {
      openTime: Number(entry.timestamp),
      closeTime: calculateCloseTime(entry.timestamp, intervalMs),
      symbol: coin.symbol,
      openInterest: openInterest,
      openInterestChange: parseFloat(openInterestChange.toFixed(2)),
    } as OpenInterestItem;
  });

  // Remove the first and last elements from the processed array
  if (data.length > 0) {
    data.shift(); // Remove the first element
    data.pop(); // Remove the last element
  }

  return {
    success: true,
    symbol: coin.symbol,
    imageUrl: coin.imageUrl,
    category: coin.category || "unknown",
    exchanges: coin.exchanges || [],
    data,
  } as OpenInterestData;
}
