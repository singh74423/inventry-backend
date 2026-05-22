import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
{
  // 🔹 Hospital
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

  // 🔹 Batch Number
  batchNumber: {
    type: String,
    required: true,
    trim: true
  },

  // 🔹 Expiry Date
  expiryDate: {
    type: Date,
    required: true
  },

  // 🔹 Available Quantity
  quantity: {
    type: Number,
    required: true,
    min: 0
  },

  // 🔹 Reserved Quantity
  reservedQuantity: {
    type: Number,
    default: 0,
    min: 0
  },

  // 🔹 Optional Manufacturer
  manufacturer: {
    type: String,
    trim: true
  },

  // 🔹 Optional Storage Location
  storageLocation: {
    type: String,
    trim: true
  }

},
{
  timestamps: true
}
);


// 🔥 FEFO INDEX
inventorySchema.index({
  medicineId: 1,
  expiryDate: 1
});


// 🔥 UNIQUE BATCH PER HOSPITAL
inventorySchema.index({
  hospitalId: 1,
  medicineId: 1,
  batchNumber: 1
}, {
  unique: true
});

export default mongoose.model(
  "Inventory",
  inventorySchema
);