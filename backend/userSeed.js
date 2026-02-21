import User from "../backend/models/userModel.js";
import bcrypt from "bcrypt";

export const seed = async () => {
  const existingAdmin = await User.findOne({ email:"clinic.admin@gmail.com" });
  if (existingAdmin) {
    const hashedPassword = await bcrypt.hash("turayishimye", 10);

    const createdUser = await new User({
      username: "Cench",
      email: "clinic.admin@gmail.com",
      role: "admin",
      password: hashedPassword,
    });
    await createdUser.save();
  }
};

