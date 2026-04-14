import jwt from "jsonwebtoken";
import Patient from "../models/Patient.js";

export const protectPatient = async (req, res, next) => {
  try {
    let token;

    // Token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "patient") {
      return res.status(403).json({ message: "Not authorized as a patient" });
    }

    // Attach patient to request
    const patient = await Patient.findById(decoded.id).select("-password");
    if (!patient) {
      return res.status(401).json({ message: "Patient not found" });
    }
    req.patient = patient;

    next();
  } catch (error) {
    res.status(401).json({ message: "Token failed" });
  }
};
