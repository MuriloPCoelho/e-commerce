"use server";

import { CalculateShippingSchema, calculateShippingSchema } from "./schema";

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: number;
}

export const calculateShipping = async (
  data: CalculateShippingSchema
): Promise<ShippingOption[]> => {
  calculateShippingSchema.parse(data);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const postalCode = data.postalCode.replace(/\D/g, "");
  const region = parseInt(postalCode.substring(0, 2));
  const basePriceInCents = region < 20 ? 1500 : region < 50 ? 2500 : region < 70 ? 3500 : 4500;
  const isFreeShippingEligible = data.productPriceInCents >= 29900;

  const shippingOptions: ShippingOption[] = [
    {
      id: "standard",
      name: "Standard Delivery",
      description: "Receive in up to 10 business days",
      price: isFreeShippingEligible ? 0 : basePriceInCents,
      estimatedDays: 10,
    },
    {
      id: "express",
      name: "Express Delivery",
      description: "Receive in up to 5 business days",
      price: Math.round(basePriceInCents * 1.8),
      estimatedDays: 5,
    },
    {
      id: "priority",
      name: "Priority Delivery",
      description: "Receive in up to 2 business days",
      price: Math.round(basePriceInCents * 2.5),
      estimatedDays: 2,
    },
  ];

  return shippingOptions;
};
