import express from "express";
import { getHospitalDashboard, getStateDashboard } from "../controllers/dashboardController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/authorize.js";

const router = express.Router();

router.get(
  "/hospital",
  protect,
  // authorize(["VIEW_DASHBOARD"]),
  getHospitalDashboard
);

router.get(
  "/state",
  protect,
  // authorize(["VIEW_DASHBOARD"]),
  getStateDashboard
);

export default router;