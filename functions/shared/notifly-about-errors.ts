import { saveErrorReport } from "../../grant-utils/errors/save-error-report.ts";

import { FetchResult } from "../../models/fetch-result.ts";

export async function notifyAboutErrors(
  binanceResult: FetchResult,
  bybitResult: FetchResult,
  projectName: string,
  functionName: string
) {
  const failedResultSymbols = [
    ...binanceResult.failedSymbols,
    ...bybitResult.failedSymbols,
  ];

  const failedResultErrors = [
    ...binanceResult.failedResults,
    ...bybitResult.failedResults,
  ];

  if (failedResultSymbols.length > 0) {
    await saveErrorReport(
      projectName,
      functionName,
      `Failed to fetch OI for ${failedResultSymbols.slice(0, 10).join(", ")}`
    );

    await saveErrorReport(
      projectName,
      functionName,
      `Failed to fetch OI for ${failedResultErrors
        .slice(0, 1)
        .map((result) => result.error)
        .join(", ")}`
    );
  }
}
