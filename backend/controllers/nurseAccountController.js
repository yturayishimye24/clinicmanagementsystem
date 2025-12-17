import NurseAccount from "../models/createNuseAccount.js";
import bcrypt from "bcrypt";
import validator from "validator";

export const createAccount = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phoneNumber,
      dateOfBirth,
      department,
      licenseNumber,
      specialization,
      experience,
      emergencyContact,
      address,
      city,
      state,
      zipCode,
      hireDate,
      shift,
      isActive = true,
    } = req.body;

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email address" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (!firstName || !lastName) {
      return res.json({
        success: false,
        message: "First name and last name are required",
      });
    }

    if (!department || !specialization) {
      return res.json({
        success: false,
        message: "Department and specialization are required",
      });
    }

    if (!licenseNumber) {
      return res.json({
        success: false,
        message: "License number is required",
      });
    }

    const existingEmail = await NurseAccount.findOne({
      email: email.toLowerCase(),
    });
    if (existingEmail) {
      return res.json({
        success: false,
        message: "Email already registered. Try a different email.",
      });
    }

    const existingPhone = await NurseAccount.findOne({ phoneNumber });
    if (existingPhone) {
      return res.json({
        success: false,
        message: "Phone number already registered",
      });
    }

    const existingLicense = await NurseAccount.findOne({ licenseNumber });
    if (existingLicense) {
      return res.json({
        success: false,
        message: "License number already registered",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newNurse = new NurseAccount({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phoneNumber: phoneNumber?.trim(),
      dateBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      department: department.trim(),
      specialization: specialization.trim(),
      licenseNumber: licenseNumber.trim().toUpperCase(),
      experience: parseInt(experience) || 0,
      emergencyContact: emergencyContact?.trim(),
      address: address?.trim(),
      city: city?.trim(),
      state: state?.trim(),
      zipCode: zipCode?.trim(),
      hireDate: hireDate ? new Date(hireDate) : new Date(),
      shift: shift || "day",
      isActive: isActive === true || isActive === "true",
      role: "nurse",
    });

    const savedNurse = await newNurse.save();

    const nurseResponse = savedNurse.toObject();
    delete nurseResponse.password;

    res.json({
      success: true,
      message: "Nurse account created successfully!",
      data: {
        nurse: nurseResponse,
        temporaryPassword: password,
      },
    });
  } catch (error) {
    console.log("Error creating nurse account", error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.json({
        success: false,
        message: `${field} already exists`,
      });
    }

    res.json({
      success: false,
      message: "Error creating nurse account. Please try again.",
    });
  }
};

export const getNurses = async (req, res) => {
 try{
 const nurses = await NurseAccount.find().sort({ createdAt: -1 });
 if(nurses && nurses.length > 0) {
   return res.status(200).json({ success: true, nurses: nurses });
 } else {
   return res.status(404).json({ success: false, message: "No nurses found" });
 }
 }catch(error){
  console.log("Error fetching nurses:", error.message);
  res.status(500).json({success:false,message:"Error fetching nurses"})
 }
};
