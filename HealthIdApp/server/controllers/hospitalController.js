import Hospital from "../models/Hospital.js";
import HospitalPatient from "../models/HospitalPatient.js";
import Patient from "../models/Patient.js";
import MedicalRecord from "../models/MedicalRecord.js";

/* ======================================================
   GET HOSPITAL PROFILE
====================================================== */
export const getHospitalProfile = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.hospital._id).select(
      "-password",
    );

    res.status(200).json(hospital);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/* ======================================================
   SEARCH PATIENT BY HEALTH ID (AUTO SAVE DIRECTORY)
====================================================== */
export const searchPatientByHealthId = async (req, res) => {
  try {
    const { healthId } = req.body;
    
    // Normalize healthId (e.g., from MH-2-026--3210 to MH-2026-3210)
    const clean = healthId.replace(/[-\s]/g, ""); 
    let normalizedId = healthId.trim();
    if (clean.length === 10 && clean.startsWith("MH")) {
      normalizedId = `MH-${clean.substring(2, 6)}-${clean.substring(6)}`;
    }
    
    const patient = await Patient.findOne({ 
      $or: [
        { healthId: healthId.trim() },
        { healthId: normalizedId }
      ]
    }).select(
      "name healthId phone bloodGroup",
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    await HospitalPatient.findOneAndUpdate(
      {
        hospitalId: req.hospital._id,
        patientId: patient._id,
      },
      {
        hospitalId: req.hospital._id,
        patientId: patient._id,
        patientName: patient.name,
        phone: patient.phone,
        lastVisit: new Date(),
      },
      { upsert: true, new: true },
    );

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: "Search failed" });
  }
};

/* ======================================================
   ADD PATIENT TO HOSPITAL DIRECTORY
====================================================== */
export const addPatientToHospital = async (req, res) => {
  try {
    const { patientId } = req.body;

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    await HospitalPatient.findOneAndUpdate(
      {
        hospitalId: req.hospital._id,
        patientId: patient._id,
      },
      {
        hospitalId: req.hospital._id,
        patientId: patient._id,
        patientName: patient.name,
        phone: patient.phone,
        lastVisit: new Date(),
      },
      { upsert: true, new: true },
    );

    res.status(200).json({ message: "Patient added to hospital directory" });
  } catch (error) {
    res.status(500).json({ message: "Failed to add patient" });
  }
};

/* ======================================================
   GET HOSPITAL PATIENT DIRECTORY
====================================================== */
export const getHospitalPatients = async (req, res) => {
  try {
    const patients = await HospitalPatient.find({
      hospitalId: req.hospital._id,
    }).populate("patientId", "name healthId phone");

    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch patients" });
  }
};

/* ======================================================
   GET UPLOADED RECORDS
====================================================== */
export const getMyUploadedRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find({
      hospital: req.hospital._id,
    }).populate("patient", "name healthId");

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch records" });
  }
};
