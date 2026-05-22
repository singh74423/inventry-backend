import mongoose from "mongoose";

const districtUserSchema =
new mongoose.Schema(
{
 firstName: {
  type: String,
  required: true,
  trim: true,
 },

 lastName: {
  type: String,
  required: true,
  trim: true,
 },

 email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true,
  match: [
   /^\S+@\S+\.\S+$/,
   "Please use a valid email address"
  ],
 },

 phoneNumber: {
  type: String,
  required: true,
  unique: true,
  match: [
   /^[0-9]{10}$/,
   "Phone number must be exactly 10 digits"
  ],
 },

 role: {
  type: String,
  enum: [
   "DISTRICT_INVENTORY_MANAGER",
   "DISTRICT_APPROVER"
  ],
  required: true,
 },

 organizationId: {
  type:
  mongoose.Schema.Types
  .ObjectId,

  ref:
  "Organization",

  required:
  true,
 }

},
{
 timestamps:
 true
}
);

const DistrictUser =
mongoose.model(
 "DistrictUser",
 districtUserSchema
);

export default
DistrictUser;