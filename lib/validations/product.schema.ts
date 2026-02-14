import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name too short"),
  price: z.number().min(0, "Price must be positive"),
  stock: z.number().int().min(0),
  category_id: z.string().uuid().optional(),
  description: z.string().optional(),
  image_url: z.string().url().optional(),
});
