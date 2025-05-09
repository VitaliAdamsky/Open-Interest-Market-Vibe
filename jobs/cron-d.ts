import { OpenInterestDataStore } from "../global/oi-data-store.ts";
import { deleteAllErrorReports } from "../grant-utils/errors/deletea-all-error-repots.ts";
import { TF } from "../grant-utils/models/timeframes.ts";
import { DColors } from "../grant-utils/servants/models/colors.ts";
import { logger } from "../grant-utils/servants/operators/logger.ts";
import { UnixToTime } from "../grant-utils/servants/utils/time/time-converter.ts";

export function cronDJob() {
  // ✅ Schedule cron job
  Deno.cron("Handle D task at 3-AM UTC", "0 4 * * *", runTask);
}

async function runTask() {
  const currentTime = UnixToTime(new Date().getTime());
  logger.info(`⏳ Cron D Job ${currentTime} is running...`, DColors.cyan);
  const timeframe = TF.D;
  await OpenInterestDataStore.updateData(timeframe);
  await deleteAllErrorReports();
}
