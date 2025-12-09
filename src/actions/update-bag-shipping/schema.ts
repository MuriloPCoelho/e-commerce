import z from "zod";

export const updateBagShippingSchema = z.object({
  shippingMethod: z.string().min(1, "Shipping method is required"),
  shippingPriceInCents: z.number().min(0, "Price must be positive"),
});

export type UpdateBagShippingSchema = z.infer<typeof updateBagShippingSchema>;
