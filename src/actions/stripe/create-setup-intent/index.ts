"use server";

import { stripe, getOrCreateStripeCustomer } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const createSetupIntent = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado");
  }

  // Obtém ou cria customer no Stripe
  const customerId = await getOrCreateStripeCustomer(session.user.id);

  const setupIntent = await stripe.setupIntents.create({
    customer: customerId,
    payment_method_types: ["card"],
    usage: "off_session",
  });

  return {
    client_secret: setupIntent.client_secret,
    customer_id: customerId,
  };
};
