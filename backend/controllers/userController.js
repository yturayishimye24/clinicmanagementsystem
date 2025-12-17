import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();
const userToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "10d" });
};
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!email || !password) {
      return res.json({ success: false, message: "Please provide email" });
    }
    if (!user) {
      return res.json({ sucess: false, message: "Invalid user" });
    }
    const isMatch = await user.verifyPassword(password);
    if (isMatch) {
      const token = userToken(user._id, user.role);
      res.json({
        success: true,
        message: "Login successfull!!",
        token,
        role: user.role,
        username: user.username,
        role: user.role,
      });
    } else {
      res.json({ success: false, message: "Incorrect password" });
    }
  } catch (error) {}
};
export const signupController = async (req, res) => {
  try {
    const { username, email, role, password } = req.body;
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }
    const exists = await User.findOne({ email});
    if (exists) {
      return res.json({
        success: false,
        message: "User already exists. Try different email.",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      role,
      password: hashedPassword,
    });
    const user = await newUser.save();
    const token = userToken(user._id, user.role);

    res.json({
      success: true,
      message: "Account created Successfully!",
      token,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    console.log("Error registering", error);
  }
};

export const getUsers = async (req, res) => {
  try {
    const userId = req.user.id;

    const userEmail = await User.findById(userId).select("email");
    const userUsername = await User.findById(userId).select("username");
    const userRole = await User.findById(userId).select("role");
    if (!userEmail) return res.status(404).json({ message: "User not found" });
    if(!userUsername) return res.status(404).json({ message: "User not found" });
    if(!userRole) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ success: true, email:userEmail.email,username:userUsername.username,role:userRole.role});
  } catch (error) {
    console.log("Error getting the user's email", error.message);
  }
};
