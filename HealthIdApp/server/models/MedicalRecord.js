import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital", // Optional: if uploaded by doctor
    },

    ownerType: {
      type: String,
      enum: ["patient", "hospital"],
      required: true,
      default: "hospital",
    },

    category: {
      type: String,
      enum: ["Prescription", "Lab Report", "Scan", "Vaccination", "Other"],
      default: "Other",
    },

    recordType: {
      type: String, // Detail like "Blood Test", "X-Ray"
    },

    fileUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("MedicalRecord", medicalRecordSchema);
