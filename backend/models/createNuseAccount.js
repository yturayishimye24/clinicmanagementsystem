import mongoose from "mongoose";

const nurseAccount = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    dateBirth: {
      type: Date,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      enum: [
        "Emergency",
        "Intensive Care Unit (ICU)",
        "Pediatrics",
        "Maternity",
        "Surgery",
        "Cardiology",
        "Oncology",
        "Orthopedics",
        "Neurology",
        "General Ward",
      ],
    },
    specialization: {
      type: String,
      required: true,
      enum: [
        "Registered Nurse (RN)",
        "Licensed Practical Nurse (LPN)",
        "Critical Care Nurse",
        "Pediatric Nurse",
        "Surgical Nurse",
        "Emergency Room Nurse",
        "Geriatric Nurse",
        "Psychiatric Nurse",
        "Oncology Nurse",
        "Cardiac Nurse",
      ],
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
      max: 50,
    },

    shift: {
      type: String,
      required: true,
      enum: ["day", "night", "rotating"],
      default: "day",
    },
    hireDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      default: "nurse",
    },

    emergencyContact: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    zipCode: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("NurseAccount", nurseAccount);
