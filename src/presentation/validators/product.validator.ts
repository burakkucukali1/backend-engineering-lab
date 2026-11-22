import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().trim().min(2).max(150),
  description: z.string().max(2000).optional(),
  sku: z.string().trim().min(2).max(50),
  price: z.coerce.number().positive().finite(),
  categoryId: z.coerce.number().int().positive(),
});

export const updateProductSchema = createProductSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const productIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const productPaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});
