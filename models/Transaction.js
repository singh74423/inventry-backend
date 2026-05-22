import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
{
  // 🔹 Transaction Type
  type: {
    type: String,
    enum: [
      "TRANSFER_DISPATCH",
      "TRANSFER_RECEIPT"
    ],
    required: true
  },

  // 🔹 Current Hospital
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true
  },

  // 🔹 Medicine
  medicineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
    required: true
  },

  // 🔹 Quantity
  quantity: {
    type: Number,
    required: true,
    min: 1
  },

  // 🔹 Source Hospital
  fromHospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital"
  },

  // 🔹 Destination Hospital
  toHospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital"
  },

  // 🔹 Related Transfer Request
  relatedRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TransferRequest"
  },

  // 🔹 Batch Tracking
  batchNumber: {
    type: String,
    trim: true
  },

  expiryDate: {
    type: Date
  },

  // 🔹 User Tracking
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  // 🔹 Remarks
  remarks: {
    type: String,
    trim: true
  }

},
{
  timestamps: true
}
);


// 🔥 INDEXES
transactionSchema.index({
  hospitalId: 1,
  createdAt: -1
});

transactionSchema.index({
  medicineId: 1,
  createdAt: -1
});

transactionSchema.index({
  relatedRequestId: 1
});

export default mongoose.model(
  "Transaction",
  transactionSchema
);