// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
// {
//   // 🔹 Name
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },

//   // 🔹 Email
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true
//   },

//   // 🔹 Password
//   password: {
//     type: String,
//     required: true
//   },

//   // 🔹 Reset Password
//   resetToken: {
//     type: String
//   },

//   resetTokenExpire: {
//     type: Date
//   },

//   // 🔹 Role
//   role: {
//     type: String,
//     enum: [

//       // 🔥 CENTRAL
//       "central_admin",

//       // 🔥 STATE
//       "state_admin",

//       // 🔥 DISTRICT
//       "district_admin",
//       "district_inventory_manager",
//       "district_approver",

//       // 🔥 HOSPITAL
//       "hospital_admin",
//       "store_manager",
//       "pharmacist",
//       "auditor"

//     ],
//     required: true
//   },

//   // 🔹 State Access
//   stateId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "State"
//   },

//   // 🔹 District Access
//   districtId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "District"
//   },

//   // 🔹 Hospital Access
//   hospitalId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Hospital"
//   },

//   // 🔹 Active / Inactive
//   status: {
//     type: Boolean,
//     default: true
//   }

// },
// {
//   timestamps: true
// }
// );


// // 🔥 KEEP ONLY THIS INDEX
// userSchema.index({
//   role: 1,
//   hospitalId: 1
// });

// export default mongoose.model(
//   "User",
//   userSchema
// );

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
{
  // 🔹 Name
  name: {
    type: String,
    required: true,
    trim: true
  },

  // 🔹 Email
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  // 🔹 Password
  password: {
    type: String,
    required: true
  },

  // 🔹 Reset Password
  resetToken: {
    type: String
  },

  resetTokenExpire: {
    type: Date
  },

  // 🔹 Role
  role: {
    type: String,
    enum: [

      // 🔥 CENTRAL
      "central_admin",

      // 🔥 STATE
      "state_admin",

      // 🔥 DISTRICT
      "district_admin",
      "district_inventory_manager",
      "district_approver",

      // 🔥 HOSPITAL
      "hospital_admin",
      "store_manager",
      "pharmacist",
      "auditor"

    ],
    required: true
  },

  // 🔹 State Access
  stateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "State"
  },

  // 🔹 District Access
  districtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "District"
  },

  // 🔹 Hospital Access
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital"
  },

  // 🔹 Reference
  referenceId: {
    type: mongoose.Schema.Types.ObjectId
  },

  referenceType: {
    type: String,
    enum: [
      "HospitalTeam",
      "DistrictUser"
    ]
  },

  // 🔹 Active / Inactive
  status: {
    type: Boolean,
    default: true
  }

},
{
  timestamps: true
}
);

// 🔐 HASH PASSWORD
userSchema.pre(
  "save",
  async function () {

    if (
      !this.isModified(
        "password"
      )
    ) return;

    const salt =
      await bcrypt.genSalt(
        10
      );

    this.password =
      await bcrypt.hash(
        this.password,
        salt
      );

});

// 🔑 PASSWORD MATCH
userSchema.methods.comparePassword =
async function (
 enteredPassword
){

 return await bcrypt.compare(
  enteredPassword,
  this.password
 );

};

// 🔥 KEEP ONLY THIS INDEX
userSchema.index({
  role: 1,
  hospitalId: 1
});

export default mongoose.model(
  "User",
  userSchema
);