import mongoose from "mongoose";
import dotenv from "dotenv";

import TransferRequest from "../models/TransferRequest.js";
import Batch from "../models/Batch.js";
import Hospital from "../models/Hospital.js";
import User from "../models/User.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

console.log("MongoDB Connected");

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function seedTransferRequest(){

await TransferRequest.deleteMany();

const batches = await Batch.find();
const hospitals = await Hospital.find();
const users = await User.find();

if(batches.length === 0){
console.log("❌ No batches found. Run batch seed first.");
process.exit();
}

let transfers=[];

for(let i=1;i<=150;i++){

const batch=random(batches);
const fromHospital=random(hospitals);
const toHospital=random(hospitals);
const user=random(users);

const transfer=await TransferRequest.create({

medicine: batch.medicine,
batch: batch._id,

quantity: Math.floor(Math.random()*20)+1,

fromHospital: fromHospital._id,
toHospital: toHospital._id,

status: "PENDING",

requestedBy: user._id,

remarks:"Auto generated transfer request"

});

transfers.push(transfer);

}

console.log("✅ TransferRequests Inserted:",transfers.length);

process.exit();

}

seedTransferRequest();