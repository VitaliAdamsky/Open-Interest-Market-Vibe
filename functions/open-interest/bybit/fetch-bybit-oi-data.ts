// deno-lint-ignore-file no-explicit-any
import { bybitOiInterval } from "../../../grant-utils/exchanges/intervals/bybit/bybit-oi-interval.ts";

import { bybitOiUrl } from "../../../grant-utils/exchanges/urls/bybit/bybit-oi-url.ts";
import { Coin } from "../../../grant-utils/models/coin.ts";
import { TF } from "../../../grant-utils/models/timeframes.ts";
import { logger } from "../../../grant-utils/servants/operators/logger.ts";
import { FailedResult } from "../../../models/failed-result.ts";
import { processBybitOpenInterestData } from "./process-bybit-open-interest-data.ts";

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
];
// Function to fetch data for a single coin from Bybit
export async function fetchBybitOiData(
  coin: Coin,
  timeframe: TF,
  limit: number
) {
  try {
    const randomUserAgent =
      userAgents[Math.floor(Math.random() * userAgents.length)];
    const bybitInterval = bybitOiInterval(timeframe);
    const url = bybitOiUrl(coin.symbol, bybitInterval, limit);
    const response = await fetch(url, {
      headers: {
        "User-Agent": randomUserAgent,
        Accept: "application/json",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        Referer: "https://www.bybit.com", // Add a referer to mimic a browser request
        Origin: "https://www.bybit.com", // Add an origin header
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 451) {
        logger.error("Binance issued a 451 error...");
      }
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorText}`
      );
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const errorText = await response.text();
      logger.error("Unexpected content type:", errorText);
      throw new Error(
        `Unexpected content type: ${contentType}, body: ${errorText}`
      );
    }
    const responseData = await response.json();
    if (
      !responseData?.result?.list ||
      !Array.isArray(responseData.result.list)
    ) {
      throw new Error(`Invalid response for ${coin.symbol}`);
    }

    return processBybitOpenInterestData(
      coin,
      responseData.result.list,
      timeframe
    );
  } catch (error: any) {
    logger.error(`Error processing ${coin.symbol}:`, error);
    return {
      success: false,
      symbol: coin.symbol,
      error: error.message.replace(/[<>'"]/g, ""),
    } as FailedResult;
  }
}
