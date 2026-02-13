import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  description: z.string().optional(),
});
