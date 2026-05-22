import mongoose from "mongoose";

const stockTransactionSchema = new mongoose.Schema(
{
  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
    required: true
  },

  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch",
    required: true
  },

  transactionType: {
    type: String,
    enum: [
      "INWARD",
      "OUTWARD",
      "TRANSFER",
      "ADJUSTMENT",
      "EXPIRED",
      "DAMAGED"
    ],
    required: true
  },

  quantity: {
    type: Number,
    required: true
  },

  sourceHospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital"
  },

  destinationHospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital"
  },

  stateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "State"
  },

  districtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "District"
  },

  transactionDate: {
    type: Date,
    default: Date.now
  },

  referenceNumber: String,

  remarks: String,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

},
{ timestamps: true }
);

export default mongoose.model("StockTransaction", stockTransactionSchema);