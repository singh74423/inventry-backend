import express from "express";
import { createTransaction, getTransactions } from "../controllers/stockController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create Stock Transaction (Hospital level)
router.post(
  "/",
  protect,
  authorize("hospital_admin", "pharmacist"),
  createTransaction
);

// Get Stock Transactions
router.get(
  "/",
  protect,
  getTransactions
);

export default router;