import bcrypt from "bcryptjs";
import crypto from "crypto";
import Patient from "../models/Patient.js";
import Consent from "../models/Consent.js";
import { sendOTPEmail } from "../services/emailService.js";

/* ======================================================
   REQUEST CONSENT (SEND OTP)
====================================================== */
export const requestConsent = async (req, res) => {
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
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Generate 6-digit secure OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Hash OTP for secure storage
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    const consent = await Consent.create({
      patientId: patient._id,
      hospitalId: req.hospital._id,
      hashedOtp,
      status: "pending",
      otpExpiresAt: Date.now() + 5 * 60 * 1000, // OTP valid for 5 mins
    });

    // Send via email to patient
    await sendOTPEmail(
      patient.email,
      otp,
      `${patient.name} (Request from ${req.hospital.hospitalName})`,
    );

    res.status(200).json({
      message: "Consent OTP sent to patient email",
      consentId: consent._id,
    });
  } catch (error) {
    console.error("Consent request error:", error);
    res.status(500).json({ message: "Consent request failed" });
  }
};

/* ======================================================
   VERIFY OTP (GRANT ACCESS)
====================================================== */
export const verifyConsentOTP = async (req, res) => {
  try {
    const { consentId, otp } = req.body;

    const consent = await Consent.findById(consentId);

    if (!consent) {
      return res.status(404).json({ message: "Consent not found" });
    }

    if (consent.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Verify hashed OTP
    const isMatch = await bcrypt.compare(otp, consent.hashedOtp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Calculate access expiry (Strict 30-minute window for hospital access)
    const accessUntil = new Date();
    accessUntil.setMinutes(accessUntil.getMinutes() + 30);

    consent.status = "approved";
    consent.expiresAt = accessUntil;
    await consent.save();

    res.status(200).json({
      message: "Access granted",
      accessUntil,
      access: true,
    });
  } catch (error) {
    console.error("Consent verify error:", error);
    res.status(500).json({ message: "OTP verification failed" });
  }
};
