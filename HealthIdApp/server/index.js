import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import recordRoutes from "./routes/recordRoutes.js";
import consentRoutes from "./routes/consentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import hospitalRoutes from "./routes/hospitalRoute.js";
import patientRoutes from "./routes/patientRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* ======================================================
   MIDDLEWARE
====================================================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ======================================================
   CORS FIX
====================================================== */
const allowedOrigins = ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, true);
    },
    credentials: true,
  }),
);

app.use("/api/patient", patientRoutes);

/* ======================================================
   STATIC FILE SERVING (uploaded files)
====================================================== */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/hospital", hospitalRoutes);

app.use("/api/consent", consentRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/public", publicRoutes);
const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    console.log("⏳ Connecting MongoDB...");
    await connectDB();
    console.log("✅ MongoDB connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
