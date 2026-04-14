import express from "express";
import { protectAdmin } from "../middleware/adminAuth.js";
import {
  adminLogin,
  getDashboardStats,
  getAllHospitals,
  getHospitalDetails,
  approveHospital,
  rejectHospital,
  deleteHospital,
  getAllPatients,
  getAllRecords,
  getAllConsents,
  getSystemStatus,
} from "../controllers/adminController.js";

const router = express.Router();

// Admin authentication
router.post("/login", adminLogin);

// Add protectAdmin middleware to all routes below this line
router.use(protectAdmin);

// Dashboard overview stats
router.get("/stats", getDashboardStats);

// View all hospitals
router.get("/hospitals", getAllHospitals);

// View single hospital
router.get("/hospital/:id", getHospitalDetails);

// Approve hospital
router.put("/approve/:id", approveHospital);

// Reject hospital
router.put("/reject/:id", rejectHospital);

// Delete hospital
router.delete("/hospital/:id", deleteHospital);

// View all patients
router.get("/patients", getAllPatients);

// View all medical records
router.get("/records", getAllRecords);

// View all consents
router.get("/consents", getAllConsents);

// System / Watchdog status (reads watchdog-status.json)
router.get("/system-status", getSystemStatus);

export default router;
