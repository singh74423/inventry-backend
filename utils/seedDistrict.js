// utils/seedDistrict.js

import mongoose from "mongoose";
import dotenv from "dotenv";

import State from "../models/State.js";
import District from "../models/District.js";

dotenv.config();

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected");
};

const districtData = {
  "Andhra Pradesh": [
    { districtName: "Visakhapatnam", districtCode: "VSK" },
    { districtName: "Vijayawada", districtCode: "VJW" },
    { districtName: "Guntur", districtCode: "GNT" }
  ],

  "Arunachal Pradesh": [
    { districtName: "Tawang", districtCode: "TWG" },
    { districtName: "Itanagar", districtCode: "ITN" },
    { districtName: "Pasighat", districtCode: "PSG" }
  ],

  "Assam": [
    { districtName: "Guwahati", districtCode: "GWH" },
    { districtName: "Dibrugarh", districtCode: "DBR" },
    { districtName: "Silchar", districtCode: "SLC" }
  ],

  "Bihar": [
    { districtName: "Patna", districtCode: "PTN" },
    { districtName: "Gaya", districtCode: "GYA" },
    { districtName: "Muzaffarpur", districtCode: "MZF" }
  ],

  "Chhattisgarh": [
    { districtName: "Raipur", districtCode: "RPR" },
    { districtName: "Bilaspur", districtCode: "BSP" },
    { districtName: "Durg", districtCode: "DRG" }
  ],

  "Goa": [
    { districtName: "North Goa", districtCode: "NGA" },
    { districtName: "South Goa", districtCode: "SGA" },
    { districtName: "Panaji", districtCode: "PNJ" }
  ],

  "Gujarat": [
    { districtName: "Ahmedabad", districtCode: "AMD" },
    { districtName: "Surat", districtCode: "SRT" },
    { districtName: "Vadodara", districtCode: "VDD" }
  ],

  "Haryana": [
    { districtName: "Gurugram", districtCode: "GRG" },
    { districtName: "Faridabad", districtCode: "FDB" },
    { districtName: "Panipat", districtCode: "PNP" }
  ],

  "Himachal Pradesh": [
    { districtName: "Shimla", districtCode: "SML" },
    { districtName: "Mandi", districtCode: "MND" },
    { districtName: "Kullu", districtCode: "KLU" }
  ],

  "Jharkhand": [
    { districtName: "Ranchi", districtCode: "RNC" },
    { districtName: "Jamshedpur", districtCode: "JSD" },
    { districtName: "Dhanbad", districtCode: "DNB" }
  ],

  "Karnataka": [
    { districtName: "Bengaluru Urban", districtCode: "BLR" },
    { districtName: "Mysuru", districtCode: "MYS" },
    { districtName: "Mangalore", districtCode: "MNG" }
  ],

  "Kerala": [
    { districtName: "Thiruvananthapuram", districtCode: "TVM" },
    { districtName: "Kochi", districtCode: "KOC" },
    { districtName: "Kozhikode", districtCode: "KZD" }
  ],

  "Madhya Pradesh": [
    { districtName: "Bhopal", districtCode: "BPL" },
    { districtName: "Indore", districtCode: "IND" },
    { districtName: "Jabalpur", districtCode: "JBP" }
  ],

  "Maharashtra": [
    { districtName: "Mumbai", districtCode: "MUM" },
    { districtName: "Pune", districtCode: "PUN" },
    { districtName: "Nagpur", districtCode: "NGP" }
  ],

  "Manipur": [
    { districtName: "Imphal East", districtCode: "IME" },
    { districtName: "Imphal West", districtCode: "IMW" },
    { districtName: "Churachandpur", districtCode: "CCP" }
  ],

  "Meghalaya": [
    { districtName: "Shillong", districtCode: "SHL" },
    { districtName: "Tura", districtCode: "TRA" },
    { districtName: "Jowai", districtCode: "JWI" }
  ],

  "Mizoram": [
    { districtName: "Aizawl", districtCode: "AZL" },
    { districtName: "Lunglei", districtCode: "LGL" },
    { districtName: "Champhai", districtCode: "CMP" }
  ],

  "Nagaland": [
    { districtName: "Kohima", districtCode: "KHM" },
    { districtName: "Dimapur", districtCode: "DMP" },
    { districtName: "Mokokchung", districtCode: "MKG" }
  ],

  "Odisha": [
    { districtName: "Bhubaneswar", districtCode: "BBS" },
    { districtName: "Cuttack", districtCode: "CTK" },
    { districtName: "Puri", districtCode: "PUR" }
  ],

  "Punjab": [
    { districtName: "Amritsar", districtCode: "AMR" },
    { districtName: "Ludhiana", districtCode: "LDH" },
    { districtName: "Patiala", districtCode: "PTL" }
  ],

  "Rajasthan": [
    { districtName: "Jaipur", districtCode: "JPR" },
    { districtName: "Jodhpur", districtCode: "JDP" },
    { districtName: "Udaipur", districtCode: "UDP" }
  ],

  "Sikkim": [
    { districtName: "Gangtok", districtCode: "GTK" },
    { districtName: "Namchi", districtCode: "NMC" },
    { districtName: "Gyalshing", districtCode: "GYL" }
  ],

  "Tamil Nadu": [
    { districtName: "Chennai", districtCode: "CHN" },
    { districtName: "Coimbatore", districtCode: "CBE" },
    { districtName: "Madurai", districtCode: "MDR" }
  ],

  "Telangana": [
    { districtName: "Hyderabad", districtCode: "HYD" },
    { districtName: "Warangal", districtCode: "WRG" },
    { districtName: "Nizamabad", districtCode: "NZB" }
  ],

  "Tripura": [
    { districtName: "Agartala", districtCode: "AGR" },
    { districtName: "Dharmanagar", districtCode: "DHM" },
    { districtName: "Udaipur", districtCode: "UDT" }
  ],

  "Uttar Pradesh": [
    { districtName: "Lucknow", districtCode: "LKO" },
    { districtName: "Noida", districtCode: "NOI" },
    { districtName: "Kanpur", districtCode: "KNP" }
  ],

  "Uttarakhand": [
    { districtName: "Dehradun", districtCode: "DED" },
    { districtName: "Haridwar", districtCode: "HRD" },
    { districtName: "Nainital", districtCode: "NTL" }
  ],

  "West Bengal": [
    { districtName: "Kolkata", districtCode: "KOL" },
    { districtName: "Howrah", districtCode: "HWH" },
    { districtName: "Darjeeling", districtCode: "DRJ" }
  ]
};

const seedDistricts = async () => {
  try {

    await connectDB();

    await District.deleteMany();

    const states = await State.find();

    for (const state of states) {

      const districts = districtData[state.name];

      if (!districts) continue;

      for (const district of districts) {

        await District.create({
          districtName: district.districtName,
          districtCode: district.districtCode,
          stateId: state._id
        });

      }
    }

    console.log("Districts Seeded Successfully");

    process.exit();

  } catch (error) {

    console.log(error);

    process.exit(1);
  }
};

seedDistricts();