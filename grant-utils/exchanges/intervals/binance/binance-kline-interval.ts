import { TF } from "../../models/timeframes.ts";

export const binanceKlineInterval = (timeframe: TF): string => {
  const binanceKlineMap: Record<TF, string> = {
    [TF.m1]: "1m",
    [TF.m5]: "5m",
    [TF.m15]: "15m",
    [TF.m30]: "30m",
    [TF.h1]: "1h",
    [TF.h2]: "2h",
    [TF.h4]: "4h",
    [TF.h6]: "6h",
    [TF.h8]: "8h",
    [TF.h12]: "12h",
    [TF.D]: "1d",
  };

  const interval = binanceKlineMap[timeframe];
  if (interval === undefined) {
    throw new Error(`Unsupported timeframe for Binance Kline: ${timeframe}`);
  }
  return interval;
};
