import mongoose from "mongoose";
import dotenv from "dotenv";

import AuditLog from "../models/AuditLog.js";
import User from "../models/User.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

console.log("MongoDB Connected");

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function seedAuditLog(){

await AuditLog.deleteMany();

const users = await User.find();

if(users.length === 0){
console.log("❌ No users found. Run user seed first.");
process.exit();
}

const actions=[
"CREATE",
"UPDATE",
"DELETE",
"LOGIN",
"TRANSFER_APPROVED"
];

const entities=[
"Medicine",
"Batch",
"StockTransaction",
"TransferRequest",
"User"
];

let logs=[];

for(let i=1;i<=200;i++){

const user=random(users);

const log=await AuditLog.create({

action: random(actions),

user: user._id,

entity: random(entities),

description:`System generated log ${i}`

});

logs.push(log);

}

console.log("✅ AuditLogs Inserted:",logs.length);

process.exit();

}

seedAuditLog();