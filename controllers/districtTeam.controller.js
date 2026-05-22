// controllers/districtTeam.controller.js

import User from "../models/User.js";
import DistrictUser from "../models/districtUser.model.js";
import mongoose from "mongoose";
// ── CREATE USER ──
// ── CREATE USER ──
export const createDistrictUser =
async (req, res) => {

try {

const {

 firstName,
 lastName,
 email,
 password,
 phoneNumber,
 role

} = req.body;

const districtId =
req.user.districtId;

console.log(
"USER FROM TOKEN:",
req.user
);

if (!districtId) {

return res
.status(400)
.json({

message:
"Invalid districtId in token"

});

}

if (
!mongoose.Types
.ObjectId
.isValid(
 districtId
)
) {

return res
.status(400)
.json({

message:
"Invalid ObjectId format"

});

}


// CHECK USER
const existingUser =
await User.findOne({
 email
});

if (
 existingUser
) {

return res
.status(400)
.json({

message:
"User already exists"

});

}


// STEP 1
const districtUser =
new DistrictUser({

 firstName,
 lastName,
 email,
 phoneNumber,
 role,

 organizationId:
 new mongoose
 .Types
 .ObjectId(
 districtId
 )

});

await districtUser
.save();


// STEP 2
const loginUser =
new User({

 name:
 `${firstName}
 ${lastName}`,

 email,

 password,

 role:
 role
 .toLowerCase(),

 districtId,

 referenceId:
 districtUser._id,

 referenceType:
 "DistrictUser"

});

await loginUser
.save();


res.status(201)
.json({

message:
"District user created successfully",

user:
districtUser

});

}

catch (err) {

console.error(
"CREATE ERROR FULL:",
err
);

res.status(500)
.json({

message:
err.message

});

}

};
// ── GET USERS ──
export const getDistrictUsers = async (req, res) => {
  try {
const districtId = req.user.districtId;

    if (!districtId) {
      return res.status(400).json({ message: "Invalid organizationId" });
    }

    const users = await DistrictUser.find({
      organizationId: districtId,
      role: { $in: ["DISTRICT_INVENTORY_MANAGER", "DISTRICT_APPROVER"] },
    }).select("-password");

    console.log("FOUND USERS:", users); // debug

    res.status(200).json(users);

  } catch (err) {
    console.error("GET ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ── DELETE USER ──
export const deleteDistrictUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await DistrictUser.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!["DISTRICT_INVENTORY_MANAGER", "DISTRICT_APPROVER"].includes(user.role)) {
      return res.status(403).json({ message: "Not allowed" });
    }

  await DistrictUser
.findByIdAndDelete(id);

await User
.findOneAndDelete({

 referenceId: id,

 referenceType:
 "DistrictUser"

});

    res.status(200).json({ message: "User deleted successfully" });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};