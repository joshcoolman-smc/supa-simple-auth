import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(72, "Password must be less than 72 characters"),
})

export type LoginFormData = z.infer<typeof loginSchema>