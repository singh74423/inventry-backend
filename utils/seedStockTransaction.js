import mongoose from "mongoose";
import dotenv from "dotenv";

import StockTransaction from "../models/StockTransaction.js";
import Batch from "../models/Batch.js";
import Hospital from "../models/Hospital.js";
import User from "../models/User.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

console.log("MongoDB Connected");

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function seedStockTransaction(){

await StockTransaction.deleteMany();

const batches = await Batch.find();
const hospitals = await Hospital.find();
const users = await User.find();

if(batches.length === 0){
console.log("❌ No batches found. Run batch seed first.");
process.exit();
}

const transactionTypes=[
"INWARD",
"OUTWARD",
"TRANSFER",
"ADJUSTMENT",
"EXPIRED",
"DAMAGED"
];

let transactions=[];

for(let i=1;i<=300;i++){

const batch=random(batches);
const hospital=random(hospitals);
const user=random(users);

const transaction=await StockTransaction.create({

medicine: batch.medicine,
batch: batch._id,

transactionType: random(transactionTypes),

quantity: Math.floor(Math.random()*50)+1,

sourceHospital: hospital._id,
destinationHospital: hospital._id,

stateId: hospital.stateId,
districtId: hospital.districtId,

referenceNumber:`REF${i}`,

remarks:"Auto generated transaction",

createdBy:user._id

});

transactions.push(transaction);

}

console.log("✅ StockTransactions Inserted:",transactions.length);

process.exit();

}

seedStockTransaction();