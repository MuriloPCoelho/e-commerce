import Stripe from "stripe";
import { getUserStripeCustomer } from "@/actions/stripe/get-user-customer";
import { createStripeCustomer } from "@/actions/stripe/create-stripe-customer";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  apiVersion: "2025-11-17.clover",
});

export const getOrCreateStripeCustomer = async (userId: string) => {
  const customerId = await getUserStripeCustomer(userId);

  if (customerId) {
    return customerId;
  }

  return await createStripeCustomer(userId);
};
