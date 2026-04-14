import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import {
  uploadRecord,
  uploadRecordByPatient,
  getMyRecords,
  getPatientRecords,
} from "../controllers/recordController.js";
import { protectHospital } from "../middleware/hospitalAuth.js";
import { protectPatient } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ======================================================
   1️⃣ Hospital Side: Records
====================================================== */
router.post("/upload", protectHospital, upload.single("file"), uploadRecord);
router.get("/:healthId", protectHospital, getPatientRecords);

/* ======================================================
   2️⃣ Patient Side: DigiLocker
====================================================== */
router.post(
  "/my/upload",
  protectPatient,
  upload.single("file"),
  uploadRecordByPatient,
);
router.get("/my/all", protectPatient, getMyRecords);

export default router;
