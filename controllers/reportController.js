import Batch from "../models/Batch.js";
import TransferRequest from "../models/TransferRequest.js";
import { logAudit } from "../utils/auditLogger.js";

// Stock Report
export const getStockReport = async (req, res) => {
  try {

    const stock = await Batch.aggregate([
      {
        $group: {
          _id: "$medicine",
          totalQuantity: {
            $sum: "$availableQty"
          }
        }
      },

      {
        $lookup: {
          from: "medicines",
          localField: "_id",
          foreignField: "_id",
          as: "medicine"
        }
      },

      {
        $unwind: {
          path: "$medicine",
          preserveNullAndEmptyArrays: true
        }
      }
    ]);

    res.json({
      message: "Stock report",
      data: stock
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Expiry Report
export const getExpiryReport = async (req, res) => {
  try {

    const today = new Date();

    const expired = await Batch.find({
      expiryDate: { $lt: today }
    }).populate("medicine");

    res.json({
      message: "Expired medicines report",
      count: expired.length,
      data: expired
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Transfer Report
export const getTransferReport = async (req, res) => {
  try {

    const transfers = await TransferRequest.find()
      .populate("medicine")
      .populate("fromHospital")
      .populate("toHospital");

    res.json({
      message: "Transfer report",
      count: transfers.length,
      data: transfers
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};