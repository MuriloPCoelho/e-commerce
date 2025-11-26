"use server";

import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const removePaymentMethod = async (paymentMethodId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Usuário não autenticado");
  }

  if (!session?.user?.stripeCustomerId) {
    throw new Error("Usuário não possui cliente Stripe associado");
  }

  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

  if (paymentMethod.customer !== session.user.stripeCustomerId) {
    throw new Error("Método de pagamento não pertence ao usuário");
  }

  await stripe.paymentMethods.detach(paymentMethodId);

  return { success: true };
};
