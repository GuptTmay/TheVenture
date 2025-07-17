import { z } from 'zod';

export const registerSchema = z.object({
  email: z.email().max(30),
  password: z.string().min(6).max(20)
})

export const loginSchema = z.object({
  email: z.email().max(30),
  password: z.string().min(6).max(20)
})

