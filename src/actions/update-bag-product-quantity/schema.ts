import { z } from "zod";

export const updateBagProductQuantitySchema = z.object({
  bagItemId: z.string(),
  quantity: z.number().int().min(1).max(999),
});

export type UpdateBagProductQuantitySchema = z.infer<
  typeof updateBagProductQuantitySchema
>;
