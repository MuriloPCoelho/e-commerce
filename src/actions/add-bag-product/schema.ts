import z from "zod";

export const addProductToBagSchema = z.object({
  productVariantSizeId: z.number().min(1),
});

export type AddProductToBagSchema = z.infer<typeof addProductToBagSchema>;