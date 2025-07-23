import { BotMail } from "./config";
import nodemailer from "nodemailer";

export async function sendOtp(email: string) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: BotMail.user,
      pass: BotMail.pass,
    },
  });

  await transporter.sendMail({
    from: `"The Venture" <${BotMail.user}>`,
    to: email,
    subject: "Verification OTP",
    text: `Your OTP is: ${otp}`,
    html: `
    <div style="font-family: Arial, sans-serif; padding: 10px;">
      <h2>Hello, User</h2>
      <p>Your OTP is:</p>
      <h1 style="color: #4CAF50;">${otp}</h1>
      <p>This OTP is valid for 30 Seconds.</p>
    </div>
  `,
  });

  return otp;
}

export const Status = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
  LOADING: "loading",
};
