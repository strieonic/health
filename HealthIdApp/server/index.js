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
import rateLimit from "express-rate-limit";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* ======================================================
   CORS HARDENING (Must be first)
====================================================== */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      // More permissive for local dev
      if (origin.startsWith('http://localhost') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }),
);

/* ======================================================
   SECURITY: RATE LIMITING
====================================================== */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5000, // Increased capacity for 110+ concurrent users
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, please try again later",
  skip: (req) => req.ip === '::1' || req.ip === '127.0.0.1', 
});
app.use(limiter);

/* ======================================================
   MIDDLEWARE
====================================================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


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
