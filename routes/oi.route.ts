import express from "npm:express@4.18.2";
import { getOpenInterestDataController } from "../controllers/oi.controller.ts";

const router = express.Router();

router.get("/oi/:timeframe", getOpenInterestDataController);

export default router;
