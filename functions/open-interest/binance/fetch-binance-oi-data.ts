import { binanceOiUrl } from "../../../grant-utils/exchanges/urls/binance/binance-oi-url.ts";
import { Coin } from "../../../grant-utils/models/coin.ts";
import { TF } from "../../../grant-utils/models/timeframes.ts";
import { DColors } from "../../../grant-utils/servants/models/colors.ts";
import { logger } from "../../../grant-utils/servants/operators/logger.ts";
import { FailedResult } from "../../../models/failed-result.ts";
import { processBinanceOpenInterestData } from "./process-binance-open-interest-data.ts";

// Array of user agents to rotate through
const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
];

// Function to fetch data for a single coin
export async function fetchBinanceOiData(
  coin: Coin,
  timeframe: TF,
  limit: number
) {
  try {
    const randomUserAgent =
      userAgents[Math.floor(Math.random() * userAgents.length)];

    const response = await fetch(binanceOiUrl(coin.symbol, timeframe, limit), {
      headers: {
        "User-Agent": randomUserAgent,
        Accept: "application/json",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        Referer: "https://www.binance.com",
        Origin: "https://www.binance.com",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 451) {
        logger.info("Binance issued a 451 error...", DColors.blue);
      }
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorText}`
      );
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const errorText = await response.text();
      console.log("Unexpected content type:", errorText);
      throw new Error(
        `Unexpected content type: ${contentType}, body: ${errorText}`
      );
    }

    const responseData = await response.json();

    if (!responseData || !Array.isArray(responseData)) {
      throw new Error(
        `Invalid response structure for ${coin.symbol}: ${JSON.stringify(
          responseData
        )}`
      );
    }

    return processBinanceOpenInterestData(coin, responseData, timeframe);
  } catch (error: any) {
    console.error(`Error processing ${coin.symbol}:`, error.message);
    return {
      success: false,
      symbol: coin.symbol,
      error: error.message.replace(/[<>'"]/g, ""),
    } as FailedResult;
  }
}
