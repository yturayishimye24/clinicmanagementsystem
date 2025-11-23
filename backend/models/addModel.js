import mongoose from "mongoose";

const addSchema = new mongoose.Schema({
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
  maritalStatus: {
    type: String,
    required: true,
  },
  disease: {
    type: String,
    required: true,
  },
});
const addedPatient = mongoose.model("addedPatient", addSchema);
export default addedPatient;
