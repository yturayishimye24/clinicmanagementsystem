import mongoose from "mongoose";

const addSchema = new mongoose.Schema({
  maritalStatus:{
    type: String,
    enum:["single","married","divorced","widowed"],
    required:true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  disease: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isHospitalized: {
    type: Boolean,
    default: false,
  },
  Status: {
    type: String,
    enum: ["active", "hospitalized", "released"],
  },
  Image: { type: String, default: "" },
});
const addedPatient = mongoose.model("addedPatient", addSchema);
export default addedPatient;
