import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  medicineCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },

  medicineName: {
    type: String,
    required: true,
    trim: true
  },

  genericName: String,
  brandName: String,
  category: String,
  dosageForm: String,
  strength: String,

  unitOfMeasure: String,
  packSize: String,

  criticalMedicine: {
    type: Boolean,
    default: false
  },

  controlledMedicine: {
    type: Boolean,
    default: false
  },

  minStockLevel: {
    type: Number,
    default: 0
  },

  reorderLevel: {
    type: Number,
    default: 0
  },

  maxStockLevel: {
    type: Number,
    default: 0
  },

  fefoApplicable: {
    type: Boolean,
    default: true
  },

  storageCondition: String,

  status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"],
    default: "ACTIVE"
  }

}, { timestamps: true });

export default mongoose.model("Medicine", medicineSchema);