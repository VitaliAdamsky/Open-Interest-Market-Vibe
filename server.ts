import initializeApp from "./app/initialize-app.ts";
import { initializeOpenInterestStore } from "./app/initialize-open-interest-operator.ts";
import { initializeServantsOperators } from "./grant-utils/functions/initialize-servants-operators.ts";
import { DColors } from "./grant-utils/servants/models/colors.ts";
import { logger } from "./grant-utils/servants/operators/logger.ts";
import { ServantsConfigOperator } from "./grant-utils/servants/operators/servants-config-operator.ts";
import { cron12hJob } from "./jobs/cron-12h.ts";

import { cron1hJob } from "./jobs/cron-1h.ts";
import { cron4hJob } from "./jobs/cron-4h.ts";
import { cronDJob } from "./jobs/cron-d.ts";

async function initializeApplication() {
  try {
    await initializeServantsOperators();
    const config = ServantsConfigOperator.getConfig();

    const app = initializeApp(config);
    await initializeOpenInterestStore();
    app.listen({ port: 80 }, "0.0.0.0", () => {
      logger.success("Server --> started...", DColors.green);
      cron1hJob();
      cron4hJob();
      cron12hJob();
      cronDJob();
    });
  } catch (error) {
    logger.error("Application initialization failed:", error);
    Deno.exit(1);
  }
}

initializeApplication();
