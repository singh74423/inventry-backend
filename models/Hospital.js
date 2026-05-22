import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
  {
    hospitalName: {
      type: String,
      required: true,
      trim: true,
    },

    hospitalCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    districtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
      required: true,
    },

    stateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },

    phone: {
      type: String,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    totalBeds: {
      type: Number,
      default: 0,
    },

    totalStock: {
      type: Number,
      default: 0,
    },

    address: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

const Hospital = mongoose.model("Hospital", hospitalSchema);

export default Hospital;