
import HospitalTeam from "../models/hospitalTeam.model.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendMail.js";
import { ROLE_PERMISSIONS } from "../constants/rolePermissions.js";


// ================= LOGIN =================
export const login = async (req, res) => {

  try {

    const { email, password } = req.body;

let user =
await User.findOne({
 email
});

// dono me nahi mila
if (!user) {

 return res.status(400)
 .json({
  message:
  "Invalid credentials"
 });

}

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      return res.status(400).json({
        message:
        "Invalid credentials"
      });
    }


    const token = jwt.sign({

      id: user._id,

      role: user.role,

      hospitalId:
      user.hospitalId,

      organizationId:
      user.organizationId,

      permissions:
      ROLE_PERMISSIONS[
        user.role.toUpperCase()
      ]

    },

    process.env.JWT_SECRET,

    { expiresIn:"1d" });


  res.json({

  token,

user: {

 _id: user._id,

 name:
  user.name,

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
}
});
  }

  catch(err){

    res.status(500).json({
      message:
      err.message
    })
  }
};



// ================= CREATE USER =================
export const createHospitalTeam =
async (req,res)=>{

try{

const {

 firstName,
 lastName,
 email,
 phoneNumber,
 role,
 password,
 hospitalId

} = req.body;


if(

!firstName ||
!lastName ||
!email ||
!phoneNumber ||
!password ||
!role

){

return res.status(400).json({

 message:
 "All fields required"

})

}


let existingUser =
await HospitalTeam.findOne({
 email,
 hospitalId:
 req.user.hospitalId
});

if (!existingUser) {

 existingUser =
 await User.findOne({
  email
 });

}

if(existingUser){

 return res.status(400).json({

  message:
  "User already exists"

 })

}


const permissions =

ROLE_PERMISSIONS[
 role.toUpperCase()
]


const normalizedRole =
role.toLowerCase();

let user;

// HOSPITAL ADMIN
if (
normalizedRole ===
"hospital_admin"
) {

user =
await User.create({

  firstName,

  lastName,

  name:
  `${firstName}
   ${lastName}`,

  email,

  phoneNumber,

  password,

  role:
  normalizedRole,


  permissions,

  hospitalId:
  req.user.hospitalId,

  organizationId:
  req.user.organizationId
});

}

// OTHER HOSPITAL TEAM
// OTHER HOSPITAL TEAM
else {

 // STEP 1 → Create Team Profile
 const hospitalTeam =
 await HospitalTeam.create({

  firstName,

  lastName,

  name:
  `${firstName}
   ${lastName}`,

  email,

  phoneNumber,

  password,

  role:
  normalizedRole,

  permissions,

  hospitalId:
  req.user.hospitalId,

  districtId:
  req.user.districtId,

  stateId:
  req.user.stateId,

  organizationId:
  req.user.organizationId,

  createdBy:
  req.user.id
 });


 // STEP 2 → Create Login User
 user =
 await User.create({

  name:
  `${firstName}
   ${lastName}`,

  email,

  password,

  role:
  normalizedRole,

  hospitalId:
  req.user.hospitalId,

  districtId:
  req.user.districtId,

  stateId:
  req.user.stateId,

  organizationId:
  req.user.organizationId,

  referenceId:
  hospitalTeam._id,

  referenceType:
  "HospitalTeam"
 });

}



const resetToken =

jwt.sign(

 {id:user._id},

 process.env.JWT_SECRET,

 {
  expiresIn:"15m"
 }

)



const resetLink =

`http://localhost:5173/reset-password/${resetToken}`



await sendEmail(

 email,

 "Set Password",


 `
 <h2>Welcome</h2>

 <p>
 Account created successfully
 </p>

 <a href="${resetLink}">
 Reset Password
 </a>
 `
)



res.status(201).json({

 message:
 "User created successfully",

 user

})

}

catch(err){

res.status(500).json({

 message:
 err.message

})

}

}



// ================= RESET PASSWORD =================
export const resetPassword =
async(req,res)=>{

try{

const {token} =
req.params

const {password} =
req.body


const decoded =

jwt.verify(

 token,

 process.env.JWT_SECRET

)



// KEEP HASHING HERE
const hashedPassword =

await bcrypt.hash(

 password,

 10
)



await User
.findByIdAndUpdate(
 decoded.id,
 {
  password:
  hashedPassword
 }
)



res.status(200).json({

 message:
 "Password reset successful"

})

}

catch{

res.status(400).json({

 message:
 "Invalid token"

})

}

}



// ================= GET ALL =================
export const getHospitalTeam =
async(req,res)=>{

try{

const users =
await HospitalTeam.find()

.populate("hospitalId")


res.status(200)
.json(users)

}

catch(err){

res.status(500)
.json({

 message:
 err.message

})

}

}



// ================= GET ADMINS =================
export const getHospitalAdmins =
async(req,res)=>{

try{

const users =

await User.find({
 role:
 "hospital_admin"
})

.populate("hospitalId")


res.status(200)
.json(users)

}

catch(err){

res.status(500)
.json({

 message:
 err.message

})

}

}



// ================= DELETE ADMIN =================
export const deleteHospitalAdmin =
async(req,res)=>{

try{

const {id} =
req.params

const user =
await User.findById(id)


if(!user){

return res.status(404)
.json({

 message:
 "User not found"

})

}


if(

user.role !==
"hospital_admin"

){

return res.status(400)
.json({

message:
"Only hospital admin delete allowed"

})

}

await User
.findByIdAndDelete(id)


res.status(200)
.json({

message:
"Deleted"

})

}

catch(err){

res.status(500)
.json({

message:
err.message

})

}

}



// ================= DELETE USER =================
export const
deleteHospitalTeam =
async(req,res)=>{

try{

const {id} =
req.params

// delete team
await HospitalTeam
.findByIdAndDelete(id)

// delete login user
await User
.findOneAndDelete({

 referenceId: id,

 referenceType:
 "HospitalTeam"

})

res.status(200)
.json({

message:
"Deleted"

})

}

catch(err){

res.status(500)
.json({

message:
err.message

})

}

}