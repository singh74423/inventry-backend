import express from "express";

import {
  createMedicine,
  getMedicines
} from "../controllers/MedicineController.js";

import {
  protect,
  authorize
} from "../middlewares/authMiddleware.js";

const router = express.Router();


// ✅ Create Medicine
router.post(
  "/",
  protect,
  authorize([], [
    "central_admin"
  ]),
  createMedicine
);


// ✅ Get Medicines
router.get(
  "/",
  getMedicines
);

export default router;