import jwt from "jsonwebtoken";
import Hospital from "../models/Hospital.js";

export const protectHospital = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Hospital not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "hospital") {
      return res.status(403).json({ message: "Not authorized as a hospital" });
    }

    const hospital = await Hospital.findById(decoded.id).select("-password");
    if (!hospital) {
      return res.status(401).json({ message: "Hospital not found" });
    }
    req.hospital = hospital;

    next();
  } catch (error) {
    res.status(401).json({ message: "Hospital token failed" });
  }
};
