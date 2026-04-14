import MedicalRecord from "../models/MedicalRecord.js";
import Patient from "../models/Patient.js";
import Consent from "../models/Consent.js";

/* ======================================================
   UPLOAD MEDICAL RECORD (HOSPITAL SIDE)
====================================================== */
export const uploadRecord = async (req, res) => {
  try {
    const { healthId, recordType, category } = req.body;

    const patient = await Patient.findOne({ healthId });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // 🔐 CONSENT CHECK
    const consent = await Consent.findOne({
      patientId: patient._id,
      hospitalId: req.hospital._id,
      status: "approved",
      expiresAt: { $gt: Date.now() }, // must not be expired
    });

    if (!consent) {
      return res.status(403).json({
        message: "Patient consent required or expired",
      });
    }

    // Cloudinary URL from multer-storage-cloudinary
    const fileUrl = req.file.path;

    const record = await MedicalRecord.create({
      patient: patient._id,
      hospital: req.hospital._id,
      ownerType: "hospital",
      category: category || "Other",
      recordType,
      fileUrl,
    });

    res.status(201).json({
      message: "Medical record uploaded",
      record,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
};

/* ======================================================
   UPLOAD MEDICAL RECORD (PATIENT SIDE - DIGILOCKER)
====================================================== */
export const uploadRecordByPatient = async (req, res) => {
  try {
    const { recordType, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const record = await MedicalRecord.create({
      patient: req.patient._id,
      ownerType: "patient",
      category: category || "Other",
      recordType,
      fileUrl: req.file.path,
    });

    res.status(201).json({
      message: "Record saved to your DigiLocker",
      record,
    });
  } catch (error) {
    console.error("Patient upload error:", error);
    res.status(500).json({ message: "Locker upload failed" });
  }
};

/* ======================================================
   GET MY RECORDS (PATIENT'S OWN LOCKER)
====================================================== */
export const getMyRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find({
      patient: req.patient._id,
    })
      .populate("hospital", "hospitalName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      totalRecords: records.length,
      records,
    });
  } catch (error) {
    res.status(500).json({ message: "Fetching your records failed" });
  }
};

/* ======================================================
   GET PATIENT RECORDS (HOSPITAL SIDE - SECURED)
====================================================== */
export const getPatientRecords = async (req, res) => {
  try {
    const { healthId } = req.params;

    const patient = await Patient.findOne({ healthId });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // 🔐 CONSENT CHECK
    const consent = await Consent.findOne({
      patientId: patient._id,
      hospitalId: req.hospital._id,
      status: "approved",
      expiresAt: { $gt: Date.now() },
    });

    if (!consent) {
      return res.status(403).json({
        message: "Patient consent required or expired",
      });
    }

    const records = await MedicalRecord.find({
      patient: patient._id,
    })
      .populate("hospital", "hospitalName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      totalRecords: records.length,
      records,
    });
  } catch (error) {
    res.status(500).json({ message: "Fetching records failed" });
  }
};
