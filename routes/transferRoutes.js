import express from "express";

import {
  createTransferRequest,
  hospitalApprove,
  hospitalReject,
  districtApprove,
  dispatchTransfer,
  receiveTransfer,
  getTransferRequests,
  getDistrictTransfers
} from "../controllers/transferController.js";

import {
  protect,
  authorize
} from "../middlewares/authMiddleware.js";

const router = express.Router();


// ======================================================
// 🔥 CREATE TRANSFER REQUEST
// ======================================================

router.post(
  "/",
  protect,
  authorize([], [
    "hospital_admin",
    "store_manager",
    "pharmacist",
    "medical_superintendent"
  ]),
  createTransferRequest
);


// ======================================================
// 🔥 HOSPITAL APPROVE
// ======================================================

router.put(
  "/hospital-approve/:id",
  protect,
  authorize([], [
    "hospital_admin",
    "store_manager",
    "medical_superintendent"
  ]),
  hospitalApprove
);


// ======================================================
// 🔥 HOSPITAL REJECT
// ======================================================

router.put(
  "/hospital-reject/:id",
  protect,
  authorize([], [
    "hospital_admin",
    "store_manager",
    "medical_superintendent"
  ]),
  hospitalReject
);


// ======================================================
// 🔥 DISTRICT APPROVE
// ======================================================

router.put(
  "/district-approve/:id",
  protect,
  authorize([], [
    "district_admin",
    "district_approver"
  ]),
  districtApprove
);


// ======================================================
// 🔥 DISPATCH
// ======================================================

router.put(
  "/dispatch/:id",
  protect,
  authorize([], [
    "hospital_admin",
    "store_manager",
    "medical_superintendent"
  ]),
  dispatchTransfer
);


// ======================================================
// 🔥 RECEIVE
// ======================================================

router.put(
  "/receive/:id",
  protect,
  authorize([], [
    "hospital_admin",
    "store_manager",
    "pharmacist",
    "medical_superintendent"
  ]),
  receiveTransfer
);


// ======================================================
// 🔥 DISTRICT TRANSFERS
// ======================================================

router.get(
  "/district-transfers",
  protect,
  authorize([], [
    "district_admin",
    "district_approver",
    "district_inventory_manager"
  ]),
  getDistrictTransfers
);


// ======================================================
// 🔥 GET ALL TRANSFERS
// ======================================================

router.get(
  "/",
  protect,
  getTransferRequests
);

export default router;