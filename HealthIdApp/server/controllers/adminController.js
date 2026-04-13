import Hospital from "../models/Hospital.js";
import Patient from "../models/Patient.js";
import MedicalRecord from "../models/MedicalRecord.js";
import Consent from "../models/Consent.js";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ======================================================
   ADMIN LOGIN (JWT-BASED)
====================================================== */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check against env credentials first (fallback for dev)
    const envEmail = process.env.ADMIN_EMAIL || "admin@healthid.com";
    const envPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (email === envEmail && password === envPassword) {
      const token = jwt.sign(
        { role: "admin", email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        message: "Admin login successful",
        token,
        admin: { name: "Super Admin", email, role: "admin" },
      });
    }

    // Alternatively, check DB-stored admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Admin login successful",
      token,
      admin: { name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Admin login failed" });
  }
};

/* ======================================================
   DASHBOARD STATS (OVERVIEW METRICS)
====================================================== */
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalPatients,
      totalHospitals,
      pendingHospitals,
      approvedHospitals,
      rejectedHospitals,
      totalRecords,
      totalConsents,
      approvedConsents,
      pendingConsents,
    ] = await Promise.all([
      Patient.countDocuments(),
      Hospital.countDocuments(),
      Hospital.countDocuments({ status: "pending" }),
      Hospital.countDocuments({ status: "approved" }),
      Hospital.countDocuments({ status: "rejected" }),
      MedicalRecord.countDocuments(),
      Consent.countDocuments(),
      Consent.countDocuments({ status: "approved" }),
      Consent.countDocuments({ status: "pending" }),
    ]);

    // Recent activity — last 7 days
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [recentPatients, recentRecords, recentHospitals] = await Promise.all([
      Patient.countDocuments({ createdAt: { $gte: weekAgo } }),
      MedicalRecord.countDocuments({ createdAt: { $gte: weekAgo } }),
      Hospital.countDocuments({ createdAt: { $gte: weekAgo } }),
    ]);

    res.status(200).json({
      totalPatients,
      totalHospitals,
      pendingHospitals,
      approvedHospitals,
      rejectedHospitals,
      totalRecords,
      totalConsents,
      approvedConsents,
      pendingConsents,
      recentPatients,
      recentRecords,
      recentHospitals,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};

/* ======================================================
   GET ALL HOSPITALS (PENDING / APPROVED / REJECTED)
====================================================== */
export const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      total: hospitals.length,
      hospitals,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch hospitals" });
  }
};

/* ======================================================
   GET SINGLE HOSPITAL DETAILS
====================================================== */
export const getHospitalDetails = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id).select("-password");

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    res.status(200).json(hospital);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hospital" });
  }
};

/* ======================================================
   APPROVE HOSPITAL
====================================================== */
export const approveHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    hospital.status = "approved";
    hospital.verifiedByAdmin = true;

    await hospital.save();

    res.status(200).json({
      message: "Hospital approved successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Approval failed" });
  }
};

/* ======================================================
   REJECT HOSPITAL
====================================================== */
export const rejectHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    hospital.status = "rejected";
    hospital.verifiedByAdmin = false;

    await hospital.save();

    res.status(200).json({
      message: "Hospital rejected",
    });
  } catch (error) {
    res.status(500).json({ message: "Rejection failed" });
  }
};

/* ======================================================
   DELETE HOSPITAL
====================================================== */
export const deleteHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id);

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    res.status(200).json({ message: "Hospital deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Deletion failed" });
  }
};

/* ======================================================
   GET ALL PATIENTS
====================================================== */
export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .select("-loginOTP -otpExpiry")
      .sort({ createdAt: -1 });

    res.status(200).json({
      total: patients.length,
      patients,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch patients" });
  }
};

/* ======================================================
   GET ALL MEDICAL RECORDS
====================================================== */
export const getAllRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find()
      .populate("patient", "name healthId phone")
      .populate("hospital", "hospitalName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      total: records.length,
      records,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch records" });
  }
};

/* ======================================================
   GET ALL CONSENTS
====================================================== */
export const getAllConsents = async (req, res) => {
  try {
    const consents = await Consent.find()
      .populate("patientId", "name healthId phone")
      .populate("hospitalId", "hospitalName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      total: consents.length,
      consents,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch consents" });
  }
};
