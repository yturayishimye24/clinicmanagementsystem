import User from "../backend/models/userModel.js";
import bcrypt from "bcrypt";

export const seed = async () => {
  const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
  if (existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin", 10);

    const createdUser = await new User({
      username: "Cench",
      email: "yummy@gmail.com",
      role: "admin",
      password: hashedPassword,
    });
    await createdUser.save();
  }
};
