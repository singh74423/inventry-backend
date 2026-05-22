import express from "express";
import {
  getNearExpiryAlerts,
  getExpiredAlerts,
  getPendingTransferAlerts,
  getReceiptPending,
  getTodayInward,
  getTodayOutward,
  getBelowReorderAlerts
} from "../controllers/alertController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ================= Alerts =================
router.get("/near-expiry", protect, getNearExpiryAlerts);
router.get("/expired", protect, getExpiredAlerts);
router.get("/pending-transfers", protect, getPendingTransferAlerts);
router.get("/receipt-pending", protect, getReceiptPending);
router.get("/today-inward", protect, getTodayInward);
router.get("/today-outward", protect, getTodayOutward);
router.get("/below-reorder", protect, getBelowReorderAlerts);

export default router;