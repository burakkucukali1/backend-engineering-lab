import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().trim().email("Invalid email address"),

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

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const updateUserSchema = z
  .object({
    email: z.string().trim().email("Invalid email address").optional(),

    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters")
      .max(50)
      .optional(),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters")
      .max(50)
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type CreateUserInput = z.infer<typeof createUserSchema>;
