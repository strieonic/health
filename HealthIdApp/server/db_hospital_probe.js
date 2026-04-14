import connectDB from "./config/db.js";
import Hospital from "./models/Hospital.js";

async function probeHospitals() {
  await connectDB();
  const allHospitals = await Hospital.find({});
  console.log("All hospitals in DB:", allHospitals);
  process.exit();
}
probeHospitals();
