import mongoose from "mongoose";
import dotenv from "dotenv";

import Batch from "../models/Batch.js";
import Medicine from "../models/Medicine.js";
import Hospital from "../models/Hospital.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

console.log("MongoDB Connected");

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function seedBatch(){

await Batch.deleteMany();

const medicines = await Medicine.find();
const hospitals = await Hospital.find();

if(medicines.length === 0){
console.log("❌ No medicines found. Run medicine seed first.");
process.exit();
}

let batches=[];

for(let i=1;i<=150;i++){

const med=random(medicines);
const hospital=random(hospitals);

const batch=await Batch.create({

medicine: med._id,

batchNumber:`BATCH${i}`,

manufacturingDate:new Date(2024,1,1),

expiryDate:new Date(2027,1,1),

manufacturingCompany:"ABC Pharma",

supplierName:"Health Supplier",

receivedQty:100,
availableQty:100,

stateId:hospital.stateId,
districtId:hospital.districtId,
hospitalId:hospital._id,

dateOfReceipt:new Date()

});

batches.push(batch);

}

console.log("✅ Batches Inserted:",batches.length);

process.exit();

}

seedBatch();