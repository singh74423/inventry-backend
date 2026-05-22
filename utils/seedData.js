import mongoose from "mongoose";
import dotenv from "dotenv";

import State from "../models/State.js";
import District from "../models/District.js";
import Hospital from "../models/Hospital.js";
import User from "../models/User.js";
import Medicine from "../models/Medicine.js";
import Batch from "../models/Batch.js";
import StockTransaction from "../models/StockTransaction.js";
import TransferRequest from "../models/TransferRequest.js";
import AuditLog from "../models/AuditLog.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

console.log("MongoDB Connected");

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function seed() {

await State.deleteMany();
await District.deleteMany();
await Hospital.deleteMany();
await User.deleteMany();
await Medicine.deleteMany();
await Batch.deleteMany();
await StockTransaction.deleteMany();
await TransferRequest.deleteMany();
await AuditLog.deleteMany();


// ---------- STATES ----------

let states = [];

for (let i = 1; i <= 20; i++) {

const state = await State.create({
name: `State ${i}`,
code: `ST${i}`
});

states.push(state);

}


// ---------- DISTRICTS ----------

let districts = [];

for (let i = 1; i <= 50; i++) {

const state = random(states);

const district = await District.create({
name: `District ${i}`,
stateId: state._id
});

districts.push(district);

}


// ---------- HOSPITALS ----------

let hospitals = [];

for (let i = 1; i <= 100; i++) {

const district = random(districts);

const hospital = await Hospital.create({
name: `Hospital ${i}`,
districtId: district._id,
stateId: district.stateId,
address: `Address ${i}`
});

hospitals.push(hospital);

}


// ---------- USERS ----------

let users = [];

for (let i = 1; i <= 100; i++) {

const hospital = random(hospitals);

const user = await User.create({
name: `User ${i}`,
email: `user${i}@test.com`,
password: "123456",
role: random([
"central_admin",
"state_admin",
"district_admin",
"hospital_admin",
"pharmacist"
]),
stateId: hospital.stateId,
districtId: hospital.districtId,
hospitalId: hospital._id
});

users.push(user);

}


// ---------- MEDICINES ----------

let medicines = [];

for (let i = 1; i <= 100; i++) {

const med = await Medicine.create({

medicineCode: `MED${i}`,
medicineName: `Medicine ${i}`,
genericName: `Generic ${i}`,
category: "Tablet",
dosageForm: "Tablet",
strength: "500mg",
unitOfMeasure: "Strip",
packSize: "10"

});

medicines.push(med);

}


// ---------- BATCHES ----------

let batches = [];

for (let i = 1; i <= 100; i++) {

const med = random(medicines);
const hospital = random(hospitals);

const batch = await Batch.create({

medicine: med._id,
batchNumber: `BATCH${i}`,
expiryDate: new Date(2027, 1, 1),

receivedQty: 100,
availableQty: 100,

stateId: hospital.stateId,
districtId: hospital.districtId,
hospitalId: hospital._id

});

batches.push(batch);

}


// ---------- STOCK TRANSACTIONS ----------

for (let i = 1; i <= 200; i++) {

const batch = random(batches);
const hospital = random(hospitals);
const user = random(users);

await StockTransaction.create({

medicine: batch.medicine,
batch: batch._id,

transactionType: random([
"INWARD",
"OUTWARD",
"TRANSFER",
"ADJUSTMENT"
]),

quantity: Math.floor(Math.random()*50)+1,

sourceHospital: hospital._id,
destinationHospital: hospital._id,

stateId: hospital.stateId,
districtId: hospital.districtId,

createdBy: user._id

});

}


// ---------- TRANSFER REQUEST ----------

for (let i = 1; i <= 100; i++) {

const batch = random(batches);
const user = random(users);

await TransferRequest.create({

medicine: batch.medicine,
batch: batch._id,

quantity: Math.floor(Math.random()*20)+1,

fromHospital: batch.hospitalId,
toHospital: random(hospitals)._id,

requestedBy: user._id

});

}


// ---------- AUDIT LOG ----------

for (let i = 1; i <= 100; i++) {

const user = random(users);

await AuditLog.create({

action: "CREATE",
user: user._id,
entity: "Medicine",
description: `Created medicine record ${i}`

});

}

console.log("✅ Dummy Data Inserted Successfully");

process.exit();

}

seed();