import StockTransaction from "../models/StockTransaction.js";
import Batch from "../models/Batch.js";
import { logAudit } from "../utils/auditLogger.js";


// Create Transaction
export const createTransaction = async (req, res) => {
  try {

    const { batch, quantity, transactionType, userId } = req.body;

    const batchData = await Batch.findById(batch);

    if (!batchData) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // Stock logic
    if (transactionType === "INWARD") {
      batchData.availableQty += quantity;
    }

    if (transactionType === "OUTWARD") {

      if (batchData.availableQty < quantity) {
        return res.status(400).json({ message: "Insufficient stock" });
      }

      batchData.availableQty -= quantity;
      batchData.issuedQty += quantity;
    }

    if (transactionType === "DAMAGED") {
      batchData.availableQty -= quantity;
      batchData.damagedQty += quantity;
    }

    if (transactionType === "EXPIRED") {
      batchData.availableQty -= quantity;
      batchData.expiredQty += quantity;
    }

    await batchData.save();

    const transaction = await StockTransaction.create(req.body);

    // Audit log
    await logAudit(
      `STOCK_${transactionType}`,
      userId,
      `Stock ${transactionType} transaction performed`,
      "Batch",
      batchData._id
    );

    res.status(201).json(transaction);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};


// Get All Transactions
export const getTransactions = async (req, res) => {
  try {

    const transactions = await StockTransaction.find()
      .populate("medicine")
      .populate("batch")
      .populate("sourceHospital")
      .populate("destinationHospital");

    res.json(transactions);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};