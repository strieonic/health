import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

/**
 * Sends an OTP email to the patient using the official Resend SDK.
 */
export const sendOTPEmail = async (email, otp, name) => {
  try {
    // 1. Initialize Resend with your API Key
    const resend = new Resend(process.env.EMAIL_API_KEY);

    // If there is no real API key, log to console safely in dev mode
    if (!process.env.EMAIL_API_KEY || process.env.EMAIL_API_KEY.includes("your_api")) {
      console.log("------------------------------------------");
      console.log(`📧 DEV MODE: EMAIL TO ${email} | OTP: ${otp}`);
      console.log("------------------------------------------");
      return true;
    }

    // 2. Send the email using the official SDK format
    const { data, error } = await resend.emails.send({
      from: `Arogyam Health <${process.env.EMAIL_FROM || 'onboarding@resend.dev'}>`,
      to: email, // Warning: Free Resend accounts only allow sending to the verified owner's email address
      subject: "Your Arogyam Login OTP",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 10px;">
          <h1 style="color: #2c3e50; text-align: center;">Welcome to Arogyam</h1>
          <p>Hello ${name || "Patient"},</p>
          <p>You requested a one-time password (OTP) to access your medical locker.</p>
          <div style="background: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #eee; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #3498db;">${otp}</span>
          </div>
          <p style="color: #666; font-size: 14px;">This code is valid for 5 minutes. If you did not request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="text-align: center; color: #999; font-size: 12px;">© 2026 Arogyam Health - Secure Medical DigiLocker</p>
        </div>
      `,
    });

    if (error) {
      console.error(`❌ Resend API blocked the email. Reason: ${error.message}`);
      console.log("------------------------------------------");
      console.log(`📧 TERMINAL FALLBACK (DEV MODE) | OTP: ${otp}`);
      console.log("------------------------------------------");
      return false;
    }

    console.log(`✅ OTP Email sent successfully to ${email}`);
    return true;
    
  } catch (err) {
    console.error(`❌ Critical Email error... falling back to terminal logging!`);
    console.log("------------------------------------------");
    console.log(`📧 TERMINAL FALLBACK (DEV MODE) | OTP: ${otp}`);
    console.log("------------------------------------------");
    return false;
  }
};
