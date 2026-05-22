import mongoose from "mongoose";
import Batch from "../models/Batch.js";
import TransferRequest from "../models/TransferRequest.js";


// ======================
// Near Expiry Alerts
// ======================
export const getNearExpiryAlerts = async (req, res) => {
  try {

    const hospitalId = req.user?.hospitalId;

    console.log("USER hospitalId:", hospitalId);

    if (!hospitalId) {
      return res.status(400).json({ message: "Hospital ID missing" });
    }

    const hospitalObjectId = new mongoose.Types.ObjectId(hospitalId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const next30 = new Date();
    next30.setDate(today.getDate() + 30);
    next30.setHours(23, 59, 59, 999);

    const batches = await Batch.find({
      hospitalId: hospitalObjectId,
      expiryDate: { $gte: today, $lte: next30 },
      medicine: { $ne: null }
    }).populate("medicine");

    console.log("NEAR EXPIRY COUNT:", batches.length);

    res.json({
      alertType: "NEAR_EXPIRY",
      count: batches.length,
      data: batches
    });

  } catch (error) {
    console.log("NEAR EXPIRY ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


// ======================
// Expired Stock Alerts
// ======================
export const getExpiredAlerts = async (req, res) => {
  try {

    const hospitalId = req.user?.hospitalId;

    if (!hospitalId) {
      return res.status(400).json({ message: "Hospital ID missing" });
    }

    const hospitalObjectId = new mongoose.Types.ObjectId(hospitalId);

    const today = new Date();

    const batches = await Batch.find({
      hospitalId: hospitalObjectId,
      expiryDate: { $lt: today },
      medicine: { $ne: null }
    }).populate("medicine");

    res.json({
      alertType: "EXPIRED_STOCK",
      count: batches.length,
      data: batches
    });

  } catch (error) {
    console.log("EXPIRED ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


// ======================
// Pending Transfer Alerts
// ======================
export const getPendingTransferAlerts = async (req, res) => {
  try {

    const hospitalId = req.user?.hospitalId;

    if (!hospitalId) {
      return res.status(400).json({ message: "Hospital ID missing" });
    }

    const hospitalObjectId = new mongoose.Types.ObjectId(hospitalId);

    const transfers = await TransferRequest.find({
      toHospital: hospitalObjectId,
      status: "PENDING"
    });

    res.json({
      alertType: "PENDING_TRANSFER",
      count: transfers.length,
      data: transfers
    });

  } catch (error) {
    console.log("TRANSFER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


// ======================
// Below Reorder Alerts  🔥 NEW
export const getBelowReorderAlerts = async (req, res) => {
  try {
    const hospitalId = req.user?.hospitalId;

    if (!hospitalId) {
      return res.status(400).json({ message: "Hospital ID missing" });
    }

    const hospitalObjectId = new mongoose.Types.ObjectId(hospitalId);

    const batches = await Batch.find({
      hospitalId: hospitalObjectId,
      medicine: { $ne: null }
    }).populate("medicine");

    const lowStock = batches.filter(b => {
      const qty = Number(b.availableQty);
      const reorder = Number(b.medicine?.reorderLevel);

      return reorder > 0 && qty < reorder;
    });

    res.json({
      alertType: "BELOW_REORDER",
      count: lowStock.length,
      data: lowStock
    });

  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


export const getReceiptPending = async (req, res) => {
  try {
    console.log("TOKEN hospitalId:", req.user.hospitalId);
    const hospitalObjectId = new mongoose.Types.ObjectId(req.user.hospitalId);

    const data = await Batch.find({
      hospitalId: hospitalObjectId,
      receivedQty: 0
    });

    res.json({
      type: "RECEIPT_PENDING",
      count: data.length,
      data
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export const getTodayInward = async (req, res) => {
  try {
    const hospitalId = req.user.hospitalId;

    const start = new Date();
    start.setHours(0,0,0,0);

    const end = new Date();
    end.setHours(23,59,59,999);

    const data = await Batch.find({
      hospitalId,
      dateOfReceipt: { $gte: start, $lte: end }
    });

    res.json({
      type: "TODAY_INWARD",
      count: data.length,
      data
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


import StockTransaction from "../models/StockTransaction.js";

export const getTodayOutward = async (req, res) => {
  try {
    const hospitalId = req.user.hospitalId;

    const start = new Date();
    start.setHours(0,0,0,0);

    const end = new Date();
    end.setHours(23,59,59,999);

    const data = await StockTransaction.find({
      hospitalId,
      type: "OUT",
      createdAt: { $gte: start, $lte: end }
    });

    res.json({
      type: "TODAY_OUTWARD",
      count: data.length,
      data
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};