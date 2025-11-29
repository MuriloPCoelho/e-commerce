"use server";

import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getOrCreateStripeCustomer } from "@/lib/stripe";

export const getCustomerPaymentMethods = async (customerId: string) => {
  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerId,
    type: "card",
  });

  return paymentMethods.data;
};

export const getMyPaymentMethods = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado");
  }

  const customerId = await getOrCreateStripeCustomer(session.user.id);

  return getCustomerPaymentMethods(customerId);
};
