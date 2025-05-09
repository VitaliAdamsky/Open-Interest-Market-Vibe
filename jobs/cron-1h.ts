import { OpenInterestDataStore } from "../global/oi-data-store.ts";
import { TF } from "../grant-utils/models/timeframes.ts";
import { DColors } from "../grant-utils/servants/models/colors.ts";
import { logger } from "../grant-utils/servants/operators/logger.ts";
import { UnixToTime } from "../grant-utils/servants/utils/time/time-converter.ts";

export function cron1hJob() {
  // ✅ Schedule cron job
  Deno.cron("Handle 1h task", { hour: { every: 1 } }, runTask);
}

async function runTask() {
  const currentTime = UnixToTime(new Date().getTime());
  logger.info(`⏳ Cron 1h Job ${currentTime} is running...`, DColors.cyan);
  const timeframe = TF.h1;
  await OpenInterestDataStore.updateData(timeframe);
}
