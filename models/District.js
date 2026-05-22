
import mongoose from "mongoose";

const districtSchema = new mongoose.Schema(
  {
    districtName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    districtCode: {
      type: String,
     
      unique: true,
      uppercase: true,
      trim: true,
    },

    stateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },

    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const District = mongoose.model("District", districtSchema);

export default District;