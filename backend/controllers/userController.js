import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv"

dotenv.config()
const userToken= (id,role)=>{
    return jwt.sign({id,role},process.env.JWT_SECRET)
}
export const loginController = async (req, res) => {
    try{
      const {email,password} = req.body;
      const user= await User.findOne({email})

      if(!user){
        res.json({sucess:false,message:"User not found"})
      }
      const isMatch= await bcrypt.compare(password,user.password)
      if(isMatch){
        const token= userToken(user._id,user.role)
        res.json({success:true,message:"Login successfull!!",token,username:user.username})
      }else{
        res.json({sucess:false,message:"Incorrect password"})
      }
    }catch(error){

    }
};
export const signupController = async (req, res) => {
  try {
    const { username, email,role, password } = req.body;
  
   
    
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }
 const exists = await User.findOne({ email });
 if (exists) {
      return res.json({ success: false, message: "User already exists. Try different email." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser =new User({
      username,
      email,
      role,
      password: hashedPassword,
      
    });
    const user = await newUser.save();
    const token=userToken(user._id,user.role)

    res.json({success:true,message:"Account created Successfully!",token,username:user.username,role:user.role})

  } catch (error) {
    console.log("Error registering",error)
  }
};
