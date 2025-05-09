import { OpenInterestDataStore } from "../global/oi-data-store.ts";
import { TF } from "../grant-utils/models/timeframes.ts";
import { DColors } from "../grant-utils/servants/models/colors.ts";
import { logger } from "../grant-utils/servants/operators/logger.ts";
import { UnixToTime } from "../grant-utils/servants/utils/time/time-converter.ts";

export function cron4hJob() {
  // ✅ Schedule cron job
  Deno.cron("Handle 4h task at 3-AM UTC", "0 4 * * *", runTask);
  Deno.cron("Handle 4h task at 7-AM UTC", "0 8 * * *", runTask);
  Deno.cron("Handle 4h task at 11-AM UTC", "0 12 * * *", runTask);
  Deno.cron("Handle 4h task at 3-PM UTC", "0 16 * * *", runTask);
  Deno.cron("Handle 4h task at 7-PM UTC", "0 20 * * *", runTask);
  Deno.cron("Handle 4h task at 11-PM UTC", "0 0 * * *", runTask);
}

async function runTask() {
  const currentTime = UnixToTime(new Date().getTime());
  logger.info(`⏳ Cron 4h Job ${currentTime} is running...`, DColors.cyan);
  const timeframe = TF.h4;
  await OpenInterestDataStore.updateData(timeframe);
}
