import mongoose from "mongoose";
import dotenv from "dotenv";

import State from "../models/State.js";
import District from "../models/District.js";
import Hospital from "../models/Hospital.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

console.log("MongoDB Connected");

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function seedHospital(){

await Hospital.deleteMany();

const districts = await District.find();

if(districts.length === 0){
console.log("❌ No districts found. Run district seed first.");
process.exit();
}

let hospitals=[];

for(let i=1;i<=100;i++){

const district=random(districts);

const hospital=await Hospital.create({

name:`Hospital ${i}`,
districtId: district._id,
stateId: district.stateId,
address:`Hospital Address ${i}`

});

hospitals.push(hospital);

}

console.log("✅ Hospitals Inserted:",hospitals.length);

process.exit();
}

seedHospital();