import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    aadhaar: {
      type: String,
    },

    healthId: {
      type: String,
      unique: true,
    },

    qrCode: {
      type: String, // QR image URL
    },

    bloodGroup: String,
    allergies: String,
    emergencyContact: String,

    loginOTP: String,
    otpExpiry: Date,
  },
  { timestamps: true },
);

export default mongoose.model("Patient", patientSchema);
