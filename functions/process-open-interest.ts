import { fetchBinanceDominantCoins } from "../grant-utils/coins/fetch-binance-dominant-coins.ts";
import { TF } from "../grant-utils/models/timeframes.ts";
import { normalizeOpenInterestData } from "./normalize/normalize-open-interest-data.ts";
import { fetchBinanceOpenInterest } from "./open-interest/binance/fetch-binance-open-interest.ts";
import { fetchBybitOpenInterest } from "./open-interest/bybit/fetch-bybit-open-interest.ts";
import { notifyAboutErrors } from "./shared/notifly-about-errors.ts";

export async function processOpenInterest(timeframe: TF, limit: number) {
  const { binanceCoins, bybitCoins } = await fetchBinanceDominantCoins();

  const binanceResult = await fetchBinanceOpenInterest(
    binanceCoins,
    timeframe,
    limit
  );

  const bybitResult = await fetchBybitOpenInterest(
    bybitCoins,
    timeframe,
    limit
  );

  let oiData = [
    ...binanceResult.successfulResults,
    ...bybitResult.successfulResults,
  ];

  oiData = normalizeOpenInterestData(oiData);

  await notifyAboutErrors(
    binanceResult,
    bybitResult,
    "OI-Market-Vibe",
    "processOpenInterest"
  );

  return oiData;
}
