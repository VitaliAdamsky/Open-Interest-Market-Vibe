import { FailedResult } from "./failed-result.ts";
import { OpenInterestData } from "./open-interest-data.ts";

export interface FetchResult {
  successfulResults: OpenInterestData[];
  successfulSymbols: string[];
  failedResults: FailedResult[];
  failedSymbols: string[];
}
