"use server";

import { stripe } from "@/lib/stripe/client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const setDefaultPaymentMethod = async (paymentMethodId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("User not authenticated");
  }

  if (!session?.user?.stripeCustomerId) {
    throw new Error("User does not have an associated Stripe customer");
  }

  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

  if (paymentMethod.customer !== session.user.stripeCustomerId) {
    throw new Error("Payment method does not belong to the user");
  }

  await stripe.customers.update(session.user.stripeCustomerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });

  return { success: true };
};
