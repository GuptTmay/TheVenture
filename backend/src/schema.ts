import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(30, "Name must be at most 30 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .max(30, "Email must be at most 30 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters"),
});

export const sendOtpSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .max(30, "Email must be at most 30 characters"),
});

export const verifyOtpSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .max(30, "Email must be at most 30 characters"),
  otp: z.string().length(6, "OTP must be exactly 6 characters"),
});

export const changePasswordSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters"),
});

export const createBlogSchema = z.object({
  title: z.string().max(200, "Title must be at most 200 characters"),
  content: z.string().max(5000, "Content must be at most 5000 characters"),
});

export const updateBlogSchema = z.object({
  title: z.string().max(200, "Title must be at most 200 characters").optional(),
  content: z
    .string()
    .max(5000, "Content must be at most 5000 characters")
    .optional(),
});
