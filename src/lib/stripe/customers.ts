"use server";

import { headers } from "next/headers";
import { auth } from "../auth";
import { getUserStripeCustomerId } from "@/actions/stripe/get-user-customer-id";
import { createStripeCustomer } from "@/actions/stripe/create-stripe-customer";

export const getOrCreateStripeCustomer = async (userId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  if (session.user.id !== userId) {
    throw new Error("User not authorized");
  }

  const customerId = session.user.stripeCustomerId || await getUserStripeCustomerId(userId);

  if (customerId) {
    return customerId;
  }

  return await createStripeCustomer(userId);
};
