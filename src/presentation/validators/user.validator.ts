import { z } from "zod";

export const createUserSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be at most 50 characters"),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be at most 50 characters"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;