import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
{
  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
    required: true
  },

  batchNumber: {
    type: String,
    required: true
  },

  manufacturingDate: Date,

  expiryDate: {
    type: Date,
    required: true
  },

  manufacturingCompany: String,
  supplierName: String,
  procurementSource: String,

  purchaseRef: String,

  unitCost: Number,

  receivedQty: {
    type: Number,
    default: 0
  },

  availableQty: {
    type: Number,
    default: 0
  },

  reservedQty: {
    type: Number,
    default: 0
  },

  issuedQty: {
    type: Number,
    default: 0
  },

  transferredQty: {
    type: Number,
    default: 0
  },

  damagedQty: {
    type: Number,
    default: 0
  },

  expiredQty: {
    type: Number,
    default: 0
  },

  storageLocation: String,

  dateOfReceipt: Date,

  stateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "State"
  },

  districtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "District"
  },

  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital"
  },

  batchStatus: {
    type: String,
    enum: ["ACTIVE", "EXPIRED", "DAMAGED"],
    default: "ACTIVE"
  }

},
{ timestamps: true }
);

batchSchema.index({ medicine: 1, batchNumber: 1 }, { unique: true });

export default mongoose.model("Batch", batchSchema);