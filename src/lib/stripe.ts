import Stripe from "stripe";
import { getUserStripeCustomerId } from "@/actions/stripe/get-user-customer-id";
import { createStripeCustomer } from "@/actions/stripe/create-stripe-customer";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  apiVersion: "2025-11-17.clover",
});

export const getOrCreateStripeCustomer = async (userId: string) => {
  const customerId = await getUserStripeCustomerId(userId);

  if (customerId) {
    return customerId;
  }

  return await createStripeCustomer(userId);
};
