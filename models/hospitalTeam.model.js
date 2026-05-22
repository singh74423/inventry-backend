

// models/hospitalTeam.model.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const hospitalTeamSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },

    lastName: {
      type: String,
      required: true,
      trim: true
    },
    
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    phoneNumber: {
      type: String,
      required: true
    },

    password: {
      type: String,
      required: true
    },

    resetToken: {
      type: String
    },

    resetTokenExpiry: {
      type: Date
    },

    role: {
      type: String,
      enum: [
        ,
        "hospital_admin",
        "MEDICAL_SUPERINTENDENT",
        "STORE_MANAGER",
        "PHARMACIST",
        "AUDITOR",
        "CENTRAL_ADMIN"
      ],
      required: true
    },

    permissions: [{ type: String }],

    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital"
    },

    // ✅ NEW
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization"
    },

    // ✅ NEW
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DistrictUser"
    }
  },
  { timestamps: true }
);

// 👉 email + hospital unique
hospitalTeamSchema.index(
  { email: 1, hospitalId: 1 },
  { unique: true }
);

// 👉 phone + hospital unique
hospitalTeamSchema.index(
  { phoneNumber: 1, hospitalId: 1 },
  { unique: true }
);

// 🔐 HASH PASSWORD
hospitalTeamSchema.pre("save", async function () {

  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);

});

// 🔑 PASSWORD MATCH
hospitalTeamSchema.methods.comparePassword =
  async function (enteredPassword) {

    return await bcrypt.compare(
      enteredPassword,
      this.password
    );
  };

export default mongoose.model(
  "HospitalTeam",
  hospitalTeamSchema
);