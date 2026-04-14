import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

const connectDB = async () => {
  try {
    // Try real MongoDB first
    if (process.env.MONGO_URI && 
        process.env.MONGO_URI !== "mongodb://localhost:27017/healthid" && 
        process.env.MONGO_URI !== "") {
      try {
        console.log("⏳ Attempting to connect to Cloud Database...");
        await mongoose.connect(process.env.MONGO_URI, {
          serverSelectionTimeoutMS: 5000, // wait up to 5s
        });
        console.log("✅ Connected to MongoDB (remote)");
        return;
      } catch (remoteErr) {
        console.error("⚠️ Remote MongoDB connection failed:", remoteErr.message);
        console.log("🔄 Falling back to local/in-memory options...");
      }
    }

    // Try local MongoDB
    try {
      await mongoose.connect("mongodb://localhost:27017/healthid", {
        serverSelectionTimeoutMS: 2000,
      });
      console.log("✅ Connected to local MongoDB");
      return;
    } catch (localErr) {
      console.log("⚠️ Local MongoDB not running, starting in-memory server...");
    }

    // Fallback to in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log("✅ Connected to in-memory MongoDB (dev fallback)");
    console.warn("❗ WARNING: Using in-memory DB. Data will be lost on server restart!");
  } catch (error) {
    console.error("❌ Critical MongoDB error:", error.message);
    if (process.env.NODE_ENV === "production") {
      console.error("⛔ Production error: MongoDB connection failed. Terminating process.");
      process.exit(1);
    }
  }
};

export default connectDB;
