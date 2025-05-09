import { Request, Response } from "npm:express@4.18.2";
import { TF } from "../grant-utils/models/timeframes.ts";
import { OpenInterestDataStore } from "../global/oi-data-store.ts";
import { logger } from "../grant-utils/servants/operators/logger.ts";

export function getOpenInterestDataController(req: Request, res: Response) {
  const tfParam = req.params.timeframe;

  const timeframe = (Object.values(TF) as string[]).find((v) => v === tfParam);
  if (!timeframe) {
    return res.status(400).json({ error: "Invalid timeframe" });
  }

  try {
    const data = OpenInterestDataStore.getData(timeframe as TF);
    return res.json(data);
  } catch (error) {
    logger.error("❌ Error in getOpenInterestDataController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
