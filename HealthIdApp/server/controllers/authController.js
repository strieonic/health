import crypto from "crypto";
import Patient from "../models/Patient.js";
import Hospital from "../models/Hospital.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../services/emailService.js";
import generateHealthId from "../utils/generateHealthId.js";
import generateQR from "../utils/qrGenerator.js";

/* ======================================================
   PATIENT REGISTRATION
====================================================== */
export const registerPatient = async (req, res) => {
  try {
    const { name, phone, email, aadhaar } = req.body;

    // check existing patient using phone or email
    const existingPatient = await Patient.findOne({
      $or: [{ phone }, { email }],
    });
    if (existingPatient) {
      return res
        .status(400)
        .json({ message: "Patient already registered with this phone/email" });
    }

    // generate HealthID
    const healthId = generateHealthId();

    // generate QR code
    const qrCode = await generateQR(healthId);

    const patient = await Patient.create({
      name,
      phone,
      email,
      aadhaar,
      healthId,
      qrCode,
    });

    res.status(201).json({
      message: "Patient registered successfully",
      patient,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Patient registration failed" });
  }
};

/* ======================================================
   SEND OTP (Real Email + Hashing)
====================================================== */
export const sendPatientOTP = async (req, res) => {
  try {
    const { identifier, phone } = req.body;
    const loginId = identifier || phone;

    const patient = await Patient.findOne({
      $or: [
        { phone: loginId },
        { email: loginId },
        { healthId: loginId }
      ]
    });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // generate 6-digit secure OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // hash OTP for secure storage
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);

    // store hashed OTP temporarily
    // store hashed OTP temporarily, using findByIdAndUpdate bypasses full schema validation for legacy records missing newer required fields
    await Patient.findByIdAndUpdate(patient._id, {
      loginOTP: hashedOTP,
      otpExpiry: Date.now() + 5 * 60 * 1000 // 5 mins
    }, { runValidators: false });

    // Send via professional email service
    await sendOTPEmail(patient.email, otp, patient.name);

    res.status(200).json({
      message: "OTP sent to your registered email address",
    });
  } catch (error) {
    console.error("OTP error:", error);
    res.status(500).json({ message: "OTP sending failed" });
  }
};

/* ======================================================
   VERIFY OTP
====================================================== */
export const verifyPatientOTP = async (req, res) => {
  try {
    const { identifier, phone, otp } = req.body;
    const loginId = identifier || phone;

    const patient = await Patient.findOne({
      $or: [
        { phone: loginId },
        { email: loginId },
        { healthId: loginId }
      ]
    });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    if (!patient.loginOTP) {
      return res.status(400).json({ message: "No OTP requested" });
    }

    // verify hashed OTP
    const isMatch = await bcrypt.compare(otp, patient.loginOTP);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (patient.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // clear OTP
    patient.loginOTP = null;
    patient.otpExpiry = null;
    await patient.save();

    // create JWT
    const token = jwt.sign(
      { id: patient._id, role: "patient" },
      process.env.JWT_SECRET,
      { expiresIn: "36500d" },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      patient,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

/* ======================================================
   HOSPITAL REGISTRATION
====================================================== */
export const registerHospital = async (req, res) => {
  try {
    const {
      hospitalName,
      regNumber,
      address,
      email,
      phone,
      password,
    } = req.body;

    const existing = await Hospital.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Hospital already exists" });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cloudinary stores the remote URL in req.file.path securely
    const licencePdf = req.file ? req.file.path : null;

    const hospital = await Hospital.create({
      hospitalName,
      regNumber,
      address,
      email,
      phone,
      password: hashedPassword,
      licencePdf,
      status: "pending",
    });

    res.status(201).json({
      message: "Hospital registration submitted. Pending admin approval.",
      hospital: {
        _id: hospital._id,
        hospitalName: hospital.hospitalName,
        email: hospital.email,
        status: hospital.status,
      },
    });
  } catch (error) {
    console.error("Hospital registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

/* ======================================================
   HOSPITAL LOGIN
====================================================== */
export const loginHospital = async (req, res) => {
  try {
    const { email, password } = req.body;

    const hospital = await Hospital.findOne({ email });
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    if (hospital.status !== "approved") {
      return res.status(403).json({
        message: "Hospital not verified by admin yet",
      });
    }

    const isMatch = await bcrypt.compare(password, hospital.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: hospital._id, role: "hospital" },
      process.env.JWT_SECRET,
      { expiresIn: "36500d" },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      hospital: {
        _id: hospital._id,
        hospitalName: hospital.hospitalName,
        email: hospital.email,
        status: hospital.status,
        regNumber: hospital.regNumber,
        address: hospital.address,
        phone: hospital.phone,
      },
    });
  } catch (error) {
    console.error("Hospital login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};
