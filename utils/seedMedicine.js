import mongoose from "mongoose";
import dotenv from "dotenv";

import Medicine from "../models/Medicine.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

console.log("MongoDB Connected");

async function seedMedicine(){

await Medicine.deleteMany();

let medicines=[];

for(let i=1;i<=100;i++){

const medicine=await Medicine.create({

medicineCode:`MED${i}`,
medicineName:`Medicine ${i}`,

genericName:`Generic ${i}`,
brandName:`Brand ${i}`,

category:"Tablet",
dosageForm:"Tablet",

strength:"500mg",

unitOfMeasure:"Strip",
packSize:"10",

criticalMedicine:false,
controlledMedicine:false,

minStockLevel:10,
reorderLevel:20,
maxStockLevel:500,

storageCondition:"Room Temperature"

});

medicines.push(medicine);

}

console.log("✅ Medicines Inserted:",medicines.length);

process.exit();

}

seedMedicine();