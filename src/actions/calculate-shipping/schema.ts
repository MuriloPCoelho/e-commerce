import z from "zod";

export const calculateShippingSchema = z.object({
  postalCode: z.string().min(8).max(9),
  productPriceInCents: z.number().min(0),
});

export type CalculateShippingSchema = z.infer<typeof calculateShippingSchema>;
