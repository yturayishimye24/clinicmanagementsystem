import { trusted } from "mongoose";
import addedPatient from "../models/addModel.js";

export const getOnePatient = async (req, res) => {
  try {
    const user = await addedPatient.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not Found!" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error finding one patient:", error.message);
    res.status(500).json({ message: "Error finding one patient." });
  }
};

export const getAllPatients = async (req, res) => {
  try {
    const patients = await addedPatient.find();
    if (!patients || patients.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No patients found." });
    }
    res.status(200).json(patients);
  } catch (error) {
    console.log("Error fetching all users:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error fetching all patients." });
  }
};

export const createPatient = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      gender,
      date,
      maritalStatus,
      disease,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !gender ||
      !date ||
      !maritalStatus ||
      !disease
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const createdPatient = await addedPatient.create({
      firstName,
      lastName,
      gender,
      date: new Date(date).getTime(),
      maritalStatus,
      disease,
    });

    // const savedUser = await createdUser.save();
    res.status(201).json(createdPatient);
  }  catch (error) {
    console.log("Error creating patient:", error.message);
    res.status(500).json({ success: false, message: "Error creating patient." });
  }
};

export const deletePatient = async (req, res) => {
  try{
    const deletedPatient = await addedPatient.findByIdAndDelete(req.params.id)
    if(deletedPatient){
      res.status(200).json({message:"Deleted Succesfully!"})
    }else{
      res.status(500).json({message:"Error deleting!"})
    }

  }catch(error){
    console.log("Error",error.message)
  }
};

export const updatePatient = async (req, res) => {
  try{
  const{firstName,lastName,gender,date,maritalStatus,disease}=req.body;
  const updatedPatient = await addedPatient.findByIdAndUpdate(req.params.id,{
    firstName,lastName,date,gender,maritalStatus,disease,
  },{new:true})
  if(!updatedPatient){
    console.log("Error updating")
  }else{
    res.status(201).json(updatedPatient)
  }
  }catch(error){
    console.log("Error Updating",error);
  }
};
