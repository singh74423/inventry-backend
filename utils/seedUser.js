import mongoose from "mongoose";
import dotenv from "dotenv";

import Hospital from "../models/Hospital.js";
import User from "../models/User.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

console.log("MongoDB Connected");

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function seedUser(){

await User.deleteMany();

const hospitals = await Hospital.find();

if(hospitals.length === 0){
console.log("❌ No hospitals found. Run hospital seed first.");
process.exit();
}

const roles=[
"central_admin",
"state_admin",
"district_admin",
"hospital_admin",
"pharmacist"
];

let users=[];

for(let i=1;i<=100;i++){

const hospital=random(hospitals);

const user=await User.create({

name:`User ${i}`,
email:`user${i}@test.com`,
password:"123456",

role: random(roles),

stateId:hospital.stateId,
districtId:hospital.districtId,
hospitalId:hospital._id

});

users.push(user);

}

console.log("✅ Users Inserted:",users.length);

process.exit();

}

seedUser();