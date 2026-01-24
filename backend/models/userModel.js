import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    role:{
      type:String,
      enum:["admin","nurse","user"],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

  },
  { timestamps: true }
);

userSchema.methods.verifyPassword = function(enteredPassword){
return bcrypt.compare(enteredPassword,this.password)

}
const Nurse = mongoose.models.Nurse || mongoose.model("User", userSchema);
export default Nurse;