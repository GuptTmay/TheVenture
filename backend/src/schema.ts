import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3).max(30),
  password: z.string().min(6).max(20),
});

export const loginSchema = z.object({
  email: z.email().max(30),
  password: z.string().min(6).max(20),
});

export const sendOtpSchema = z.object({
  email: z.email().max(30),
});

export const verifyOtpSchema = z.object({
  email: z.email().max(30),
  otp: z.string().min(6).max(6),
});

export const changePasswordSchema = z.object({
  password: z.string().min(6).max(20),
});
