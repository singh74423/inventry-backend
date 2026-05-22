import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import connectDB from "../config/db.js";
import User from "../models/User.js";
import State from "../models/State.js";
import District from "../models/District.js";

// ✅ Load .env from backend root
dotenv.config({ path: "../.env" });

const seedDistrictUsers = async () => {
  try {
    // ✅ Connect DB
    await connectDB();

    // ✅ Get first state & district
    const state = await State.findOne();
    const district = await District.findOne();

    if (!state || !district) {
      console.log("❌ First create State & District");
      process.exit(1);
    }

    const users = [
      {
        name: "District Inventory Manager",
        email: "inventorymanager@gmail.com",
        role: "district_inventory_manager",
      },
      {
        name: "District Approver",
        email: "districtapprover@gmail.com",
        role: "district_approver",
      },
    ];

    for (const userData of users) {
      // ✅ Check existing user
      const existingUser = await User.findOne({
        email: userData.email,
      });

      if (existingUser) {
        console.log(`⚠️ ${userData.role} already exists`);
        continue;
      }

      // ✅ Hash password
      const hashedPassword = await bcrypt.hash("123456", 10);

      // ✅ Create user
      const user = await User.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        stateId: state._id,
        districtId: district._id,
      });

      console.log(`✅ ${user.role} Created -> ${user.email}`);
    }

    console.log("🎉 District Users Seeding Completed");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

seedDistrictUsers();