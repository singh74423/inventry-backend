import express from "express";
import {
  getStockReport,
  getExpiryReport,
  getTransferReport
} from "../controllers/reportController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Stock report
router.get(
  "/stock",
  protect,
  getStockReport
);

// Expiry report
router.get(
  "/expiry",
  protect,
  getExpiryReport
);

// Transfer report
router.get(
  "/transfers",
  protect,
  getTransferReport
);

export default router;