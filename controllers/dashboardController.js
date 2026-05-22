import Medicine from "../models/Medicine.js";
import Batch from "../models/Batch.js";
import TransferRequest from "../models/TransferRequest.js";
import District from "../models/District.js";
import Hospital from "../models/Hospital.js";
import mongoose from "mongoose";

export const getHospitalDashboard = async (req, res) => {
  try {
    const hospitalObjectId = new mongoose.Types.ObjectId(req.user.hospitalId);

    if (!hospitalObjectId) {
      return res.status(400).json({ message: "Hospital ID missing" });
    }

    const today = new Date();
    const next30 = new Date();
    next30.setDate(today.getDate() + 30);

    // 🔥 DEBUG (optional - check data aa raha hai ya nahi)
    const debugBatches = await Batch.find({ hospitalId: hospitalObjectId });
    console.log("DEBUG BATCHES COUNT:", debugBatches.length);

    // Total distinct medicines
    const totalMedicinesAgg = await Batch.aggregate([
      { $match: { hospitalId: hospitalObjectId } },
      { $group: { _id: "$medicine" } },
      { $count: "total" }
    ]);

    const totalMedicines = totalMedicinesAgg[0]?.total || 0;

    // Total batches
    const totalBatches = await Batch.countDocuments({
      hospitalId: hospitalObjectId
    });

    // Near expiry
    const nearExpiry = await Batch.countDocuments({
      hospitalId: hospitalObjectId,
      expiryDate: { $lte: next30, $gte: today }
    });

    // Expired
    const expired = await Batch.countDocuments({
      hospitalId: hospitalObjectId,
      expiryDate: { $lt: today }
    });

    // Out of stock
    const outOfStockMedicines = await Batch.countDocuments({
      hospitalId: hospitalObjectId,
      availableQty: 0
    });

    // Low stock
    const lowStockMedicines = await Batch.countDocuments({
      hospitalId: hospitalObjectId,
      availableQty: { $lte: 10, $gt: 0 }
    });

    // Incoming transfers
    const pendingIncomingTransfers = await TransferRequest.countDocuments({
      toHospital: hospitalObjectId,
      status: { $in: ["PENDING", "APPROVED", "DISPATCHED"] }
    });

    // Outgoing transfers
    const pendingOutgoingTransfers = await TransferRequest.countDocuments({
      fromHospital: hospitalObjectId,
      status: { $in: ["PENDING", "APPROVED"] }
    });

    // Total stock quantity
    const totalStock = await Batch.aggregate([
      { $match: { hospitalId: hospitalObjectId } },
      {
        $group: {
          _id: null,
          totalQty: { $sum: "$availableQty" }
        }
      }
    ]);

    // Stock by medicine
    const stockByMedicine = await Batch.aggregate([
      { $match: { hospitalId: hospitalObjectId } },
      {
        $group: {
          _id: "$medicine",
          totalQty: { $sum: "$availableQty" }
        }
      },
      {
        $lookup: {
          from: "medicines",
          localField: "_id",
          foreignField: "_id",
          as: "medicineDetails"
        }
      },
      { $unwind: { path: "$medicineDetails", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          medicineId: "$_id",
          medicineName: "$medicineDetails.medicineName",
          totalQty: 1,
          _id: 0
        }
      }
    ]);

    // 🔥 IMPORTANT FIX → only available stock
    const batchStock = await Batch.find({
      hospitalId: hospitalObjectId,
      availableQty: { $gt: 0 }
    })
      .populate("medicine", "medicineName")
      .sort({ expiryDate: 1 });

    // Receipt pending
    const receiptPending = await TransferRequest.countDocuments({
      toHospital: hospitalObjectId,
      status: "DISPATCHED"
    });

    // Today's inward
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayInward = await Batch.countDocuments({
      hospitalId: hospitalObjectId,
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    // Today's outward
    const todayOutward = await TransferRequest.countDocuments({
      fromHospital: hospitalObjectId,
      status: "COMPLETED",
      updatedAt: { $gte: startOfDay, $lte: endOfDay }
    });

    // ✅ FINAL RESPONSE
    res.json({
      success: true,
      data: {
        totalMedicines,
        totalBatches,
        totalStockQuantity: totalStock[0]?.totalQty || 0,
        nearExpiry,
        expired,
        lowStockMedicines,
        outOfStockMedicines,
        pendingIncomingTransfers,
        pendingOutgoingTransfers,
        stockByMedicine,
        batchStock,
        receiptPending,
        todayInward,
        todayOutward
      }
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getStateDashboard = async (req, res) => {
  try {
    const stateId = req.user?.stateId;

    if (!stateId) {
      return res.status(400).json({ message: "State ID missing" });
    }

    const stateObjectId = new mongoose.Types.ObjectId(stateId);
    const today = new Date();
    const next30 = new Date();
    next30.setDate(today.getDate() + 30);

    // Total districts
    const totalDistricts = await District.countDocuments({ state: stateObjectId });

    // Total hospitals
    const totalHospitals = await Hospital.countDocuments({ state: stateObjectId });

    // Total batches
    const totalBatches = await Batch.countDocuments({ stateId: stateObjectId });

    // Near expiry batches
    const nearExpiry = await Batch.countDocuments({
      stateId: stateObjectId,
      expiryDate: { $lte: next30, $gte: today }
    });

    // Expired batches
    const expired = await Batch.countDocuments({
      stateId: stateObjectId,
      expiryDate: { $lt: today }
    });

    // Low stock batches
    const lowStock = await Batch.countDocuments({
      stateId: stateObjectId,
      availableQty: { $lte: 10, $gt: 0 }
    });

    // Out of stock batches
    const outOfStock = await Batch.countDocuments({
      stateId: stateObjectId,
      availableQty: 0
    });

    // Total stock quantity
    const totalStock = await Batch.aggregate([
      { $match: { stateId: stateObjectId } },
      {
        $group: {
          _id: null,
          totalQty: { $sum: "$availableQty" }
        }
      }
    ]);

    // Pending transfers
    const pendingTransfers = await TransferRequest.countDocuments({
      stateId: stateObjectId,
      status: { $in: ["PENDING", "APPROVED"] }
    });

    // Stock by district (additional useful data)
    const stockByDistrict = await Batch.aggregate([
      { $match: { stateId: stateObjectId } },
      {
        $lookup: {
          from: "hospitals",
          localField: "hospitalId",
          foreignField: "_id",
          as: "hospital"
        }
      },
      {
        $unwind: "$hospital"
      },
      {
        $group: {
          _id: "$hospital.district",
          totalQty: { $sum: "$availableQty" }
        }
      },
      {
        $lookup: {
          from: "districts",
          localField: "_id",
          foreignField: "_id",
          as: "districtDetails"
        }
      },
      {
        $unwind: {
          path: "$districtDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          districtName: "$districtDetails.name",
          totalQty: 1,
          _id: 0
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalDistricts,
        totalHospitals,
        totalBatches,
        totalStockQuantity: totalStock[0]?.totalQty || 0,
        nearExpiry,
        expired,
        lowStock,
        outOfStock,
        pendingTransfers,
        stockByDistrict
      }
    });

  } catch (error) {
    console.error("Error in getStateDashboard:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};