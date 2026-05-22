import User from "../models/User.js";
import HospitalTeam from "../models/hospitalTeam.model.js";
import DistrictUser from "../models/districtUser.model.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { ROLE_PERMISSIONS } from "../constants/rolePermissions.js";


// ================= LOGIN =================
// ================= LOGIN =================
export const loginUser =
async (req, res) => {

try {

const {
 email,
 password
} = req.body;

const normalizedEmail =
email.toLowerCase()
.trim();


// ONLY USERS LOGIN
let user =
await User.findOne({

 email:
 normalizedEmail

});

console.log(
"FOUND USER:",
user
);


if (!user) {

return res
.status(404)
.json({

message:
"User not found"

});

}


// PASSWORD CHECK
const match =
await bcrypt.compare(

 password,

 user.password

);

if (!match) {

return res
.status(400)
.json({

message:
"Invalid password"

});

}


// PERMISSIONS
user.permissions =

ROLE_PERMISSIONS[
 user.role?.toUpperCase()
] || [];


// PROFILE LOOKUP
let profile = null;

if (

user.referenceType ===
"HospitalTeam"

) {

profile =
await HospitalTeam
.findById(

user.referenceId

);

}


if (

user.referenceType ===
"DistrictUser"

) {

profile =
await DistrictUser
.findById(

user.referenceId

);

}


// TOKEN GENERATE
const token =
jwt.sign(

{

 id:
 user._id,

 role:
 user.role,

 permissions:
 user.permissions,

 stateId:
 user.stateId,

 districtId:
 user.districtId,

 hospitalId:
 user.hospitalId,

 organizationId:
 user.organizationId

},

process.env
.JWT_SECRET,

{
 expiresIn:
 "1d"
}

);


// RESPONSE
res.json({

message:
"Login successful",

token,

user: {

 _id:
 user._id,

 email:
 user.email,

 role:
 user.role,

 hospitalId:
 user.hospitalId,

 districtId:
 user.districtId,

 stateId:
 user.stateId,

 organizationId:
 user.organizationId

},

profile

});

}

catch (error) {

res.status(500)
.json({

message:
error.message

});

}

};

// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    const normalizedEmail =
      email.toLowerCase().trim();

    let user =
      await User.findOne({
        email: normalizedEmail
      });

    if (!user) {
      user =
        await HospitalTeam.findOne({
          email: normalizedEmail
        });
    }

    if (!user) {
      user =
        await DistrictUser.findOne({
          email: normalizedEmail
        });
    }

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // token generate
    const token =
      crypto.randomBytes(32)
      .toString("hex");

    user.resetToken = token;

    user.resetTokenExpire =
      Date.now() +
      10 * 60 * 1000;

    await user.save();

    const resetLink =
      `http://localhost:5173/reset-password/${token}`;

    res.json({
      message:
        "Reset link generated",
      resetLink
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    });
  }
};


// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  try {

    const { token } =
      req.params;

    const { password } =
      req.body;

    let user =
      await User.findOne({
        resetToken: token,
        resetTokenExpire: {
          $gt: Date.now()
        }
      });

    if (!user) {
      user =
        await HospitalTeam.findOne({
          resetToken: token,
          resetTokenExpire: {
            $gt: Date.now()
          }
        });
    }

    if (!user) {
      user =
        await DistrictUser.findOne({
          resetToken: token,
          resetTokenExpire: {
            $gt: Date.now()
          }
        });
    }

    if (!user) {
      return res.status(400).json({
        message:
          "Invalid or expired token"
      });
    }

    // hash password
    const salt =
      await bcrypt.genSalt(10);

    user.password =
      await bcrypt.hash(
        password,
        salt
      );

    // clear token
    user.resetToken = null;
    user.resetTokenExpire = null;

    await user.save();

    res.json({
      message:
        "Password updated successfully"
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    });
  }
};