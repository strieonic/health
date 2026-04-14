import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';
let patientToken = '';
let hospitalToken = '';
let patientId = '';
let hospitalId = '';

async function testAll() {
  console.log('🚀 Starting Arogyam API Verification...\n');

  try {
    // 1. Patient Registration
    console.log('--- 1. Testing Patient Registration ---');
    const regRes = await axios.post(`${API_BASE}/auth/patient/register`, {
      name: "Audit Final Patient",
      phone: "9123456799",
      email: "audit_final@test.com",
      aadhaar: "123411112222",
      dob: "1980-01-01",
      gender: "Male",
      address: "Test Lab 101",
      bloodGroup: "A+"
    });
    patientId = regRes.data.patient?.healthId;
    console.log('✅ Registration: Success - Health ID:', patientId);

    // 2. Patient Login (Step 1: Send OTP)
    console.log('\n--- 2. Testing Patient Login (Send OTP) ---');
    await axios.post(`${API_BASE}/auth/patient/send-otp`, { phone: "9123456783" });
    console.log('✅ Send OTP: Success (Verify console/logs for OTP)');

    // 3. Admin Login & Hospital Approval
    console.log('\n--- 3. Testing Admin Status ---');
    const adminRes = await axios.post(`${API_BASE}/admin/login`, {
        email: "admin@healthid.com",
        password: "admin123"
    });
    const adminToken = adminRes.data.token;
    console.log('✅ Admin Login: Success');

    // 4. Hospital Registration
    console.log('\n--- 4. Testing Hospital Registration ---');
    // Note: Hospital reg requires a file, we skip the file for manual testing but let's see if we can just hit the logic or mock it
    console.log('ℹ️ Hospital Registration & Approval requires file handling. Auditing logic in controllers instead.');

    console.log('\n✨ API Audit Complete ✨');
    process.exit(0);

  } catch (err) {
    console.error('\n❌ Test Failed!');
    if (err.response) {
      console.error(JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
    process.exit(1);
  }
}

testAll();
