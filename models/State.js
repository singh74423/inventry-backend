import mongoose from "mongoose";

const stateSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    unique: true   // same state name dubara insert nahi hoga
  },

  code: {
    type: String,
    required: true,
    unique: true   // same state code bhi dubara nahi hoga
  },

  status: {
    type: Boolean,
    default: true
  }
},
{
  timestamps: true
}
);

const State = mongoose.model("State", stateSchema);

export default State;