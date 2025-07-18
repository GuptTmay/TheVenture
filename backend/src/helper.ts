import { BotMail } from "./config";
import redisClient from "./redisClient";
import nodemailer from "nodemailer";

export async function sendOtp(email: string) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redisClient.set(`otp:${email}`, otp, { EX: 300 });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: BotMail.user,
      pass: BotMail.pass,
    },
  });

  await transporter.sendMail({
    to: email,
    subject: "The Venture OTP",
    text: `Your OTP is: ${otp}`,
    html: `
    <div style="font-family: Arial, sans-serif; padding: 10px;">
      <h2>Hello, User</h2>
      <p>Your OTP is:</p>
      <h1 style="color: #4CAF50;">${otp}</h1>
      <p>This OTP is valid for 5 minutes.</p>
    </div>
  `,
  });

  return otp;
}

export async function verifyOtp(email: string, otp: string) {
  const storedOtp = await redisClient.get(`otp:${email}`);
  return storedOtp === otp;
}

export async function setEmailVerified(email: string) {
  await redisClient.set(`verify:${email}`, "yes", { EX: 300 });
}

