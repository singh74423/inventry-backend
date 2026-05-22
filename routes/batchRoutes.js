import express from "express";

import {
  createBatch,
  getBatches,
  deleteBatch
} from "../controllers/batchController.js";

import {
  protect,
  authorize
} from "../middlewares/authMiddleware.js";

const router = express.Router();


// ✅ Create Batch
router.post(
  "/",
  protect,
  authorize(
    [],
    [
      "hospital_admin",
      "pharmacist",
      "store_manager"
    ]
  ),
  createBatch
);


// ✅ Get Batches
router.get(
  "/",
  protect,
  getBatches
);


// ✅ Delete Batch
router.delete(
  "/:id",
  protect,
  authorize(
    [],
    [
      "hospital_admin",
      "pharmacist",
      "store_manager"
    ]
  ),
  deleteBatch
);

export default router;