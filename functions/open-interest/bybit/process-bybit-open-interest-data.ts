// deno-lint-ignore-file no-explicit-any

import { calculateCloseTime } from "../../../grant-utils/exchanges/utils/calculate-close-time.Ts";
import { getIntervalDurationMs } from "../../../grant-utils/exchanges/utils/get-interval-duration-ms.ts";
import { Coin } from "../../../grant-utils/models/coin.ts";
import { TF } from "../../../grant-utils/models/timeframes.ts";
import {
  OpenInterestData,
  OpenInterestItem,
} from "../../../models/open-interest-data.ts";

// Function to process the data for a single coin from Bybit
export function processBybitOpenInterestData(
  coin: Coin,
  rawEntries: any,
  timeframe: TF
) {
  const intervalMs = getIntervalDurationMs(timeframe);
  // Sort the raw entries by timestamp in ascending order
  const sortedEntries = [...rawEntries].sort(
    (a: any, b: any) => Number(a.timestamp) - Number(b.timestamp)
  );

  // Process the sorted entries into OpenInterestItem objects
  const data = sortedEntries.map((entry: any, index: number, arr: any) => {
    const currentValue = Number(entry.openInterest);

    let openInterestChange = null;
    if (index > 0) {
      const prevValue = Number(arr[index - 1].openInterest);
      if (prevValue !== 0) {
        openInterestChange = Number(
          (((currentValue - prevValue) / Math.abs(prevValue)) * 100).toFixed(2)
        );
      } else {
        openInterestChange = currentValue !== 0 ? 100 : 0;
      }
    }

    return {
      symbol: coin.symbol,
      openTime: Number(entry.timestamp),
      closeTime: calculateCloseTime(entry.timestamp, intervalMs),
      openInterest: Number(currentValue.toFixed(2)),
      openInterestChange,
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
    exchanges: coin.exchanges || [],
    imageUrl: coin.imageUrl || "",
    category: coin.category || "",
    data,
  } as OpenInterestData;
}
