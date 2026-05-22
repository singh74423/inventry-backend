import mongoose from "mongoose";

const transferRequestSchema = new mongoose.Schema(
{
  // 🔹 Medicine
  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
    required: true
  },

  batch: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Inventory"
},

  // 🔹 Quantity
  quantity: {
    type: Number,
    required: true
  },

  // 🔹 Requesting Hospital
  fromHospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true
  },

  // 🔹 Supplier Hospital
  toHospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true
  },

  // 🔹 State & District
  stateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "State"
  },

  districtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "District"
  },

  // 🔹 Transfer Type
  transferType: {
    type: String,
    enum: [
      "INTRA_DISTRICT",
      "INTER_DISTRICT",
      "INTER_STATE"
    ],
    default: "INTRA_DISTRICT"
  },

  // 🔹 Status Flow
  status: {
    type: String,
    enum: [
      "PENDING",
      "HOSPITAL_APPROVED",
      "UNDER_REVIEW",
      "DISTRICT_APPROVED",
      "DISPATCHED",
      "RECEIVED",
      "COMPLETED",
      "REJECTED"
    ],
    default: "PENDING"
  },

  // 🔹 Approval Tracking
  hospitalApproved: {
    type: Boolean,
    default: false
  },

  districtApproved: {
    type: Boolean,
    default: false
  },

  // 🔹 Request Creator
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // 🔹 Approval Users
  approvedByHospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  reviewedByDistrict: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  approvedByDistrict: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  // 🔹 Reject Tracking
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  // 🔹 Dispatch & Receive
  dispatchDate: {
    type: Date
  },

  receivedDate: {
    type: Date
  },

  completedAt: {
    type: Date
  },

  // 🔹 Remarks
  hospitalRemarks: {
    type: String,
    trim: true
  },

  districtRemarks: {
    type: String,
    trim: true
  },

  receiveRemarks: {
    type: String,
    trim: true
  },

  // 🔹 Emergency Request
  emergency: {
    type: Boolean,
    default: false
  }

},
{
  timestamps: true
}
);

export default mongoose.model(
  "TransferRequest",
  transferRequestSchema
);