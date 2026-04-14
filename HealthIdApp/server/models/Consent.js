import mongoose from "mongoose";

const consentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },

    hashedOtp: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // When the OTP itself expires (e.g., 5 mins)
    otpExpiresAt: {
      type: Date,
      required: true,
    },

    // How long the hospital has access (e.g., 24 hours from approval)
    accessDuration: {
      type: Number, // in hours
      default: 24,
    },

    expiresAt: Date, // Calculated when approved
  },
  { timestamps: true },
);

export default mongoose.model("Consent", consentSchema);
