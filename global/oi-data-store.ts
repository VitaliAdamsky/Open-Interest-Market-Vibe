import { processDayOpenInterest } from "../functions/process-day-open-interest.ts";
import { processOpenInterest } from "../functions/process-open-interest.ts";
import { TF } from "../grant-utils/models/timeframes.ts";
import { DColors } from "../grant-utils/servants/models/colors.ts";
import { logger } from "../grant-utils/servants/operators/logger.ts";
import { OpenInterestData } from "../models/open-interest-data.ts";

export class OpenInterestDataStore {
  private static limit: number = 52;
  private static data: Partial<Record<TF, OpenInterestData[]>> = {};

  private constructor() {
    // Private constructor to prevent instantiation
  }

  public static async initialize(): Promise<void> {
    // Fetch and store data for each timeframe
    await OpenInterestDataStore.updateData(TF.h1);
    await OpenInterestDataStore.updateData(TF.h4);
    await OpenInterestDataStore.updateData(TF.h12);
    await OpenInterestDataStore.updateData(TF.D);

    logger.info("OpenInterestDataStore ---> initialized...", DColors.cyan);
  }

  public static async updateData(timeframe: TF): Promise<void> {
    if (timeframe === TF.D) {
      const oiData = await processDayOpenInterest(this.limit);
      OpenInterestDataStore.data[timeframe] = oiData;
      logger.info(
        `OpenInterestDataStore ---> Data fetched and stored for timeframe: ${timeframe}`,
        DColors.cyan
      );
      return;
    }

    const oiData = await processOpenInterest(timeframe, this.limit);
    OpenInterestDataStore.data[timeframe] = oiData;
    logger.info(
      `OpenInterestDataStore ---> Data fetched and stored for timeframe: ${timeframe}`,
      DColors.cyan
    );
  }

  public static getData(timeframe: TF): OpenInterestData[] {
    console.log(`Retrieving data for timeframe: ${timeframe}`);
    return OpenInterestDataStore.data[timeframe] || [];
  }
}
