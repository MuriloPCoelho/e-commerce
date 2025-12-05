"use server";

import { stripe } from "@/lib/stripe/client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const getCustomerPaymentMethods = async (customerId: string) => {
  if (!customerId) {
    throw new Error("Customer ID is required");
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) throw new Error("User not authenticated");

  if (typeof customerId !== "string" || !customerId.startsWith("cus_")) {
    throw new Error("Invalid customer ID");
  }

  if (customerId !== session.user.stripeCustomerId) {
    throw new Error("Customer ID does not belong to the user");
  }

  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    });

    return paymentMethods.data;
  } catch (error) {
    throw new Error("Failed to retrieve payment methods");
  }
};
