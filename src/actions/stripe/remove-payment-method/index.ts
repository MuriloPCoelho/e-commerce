"use server";

import { stripe, getOrCreateStripeCustomer } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Remove um método de pagamento do customer
 */
export const removePaymentMethod = async (paymentMethodId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado");
  }

  const customerId = await getOrCreateStripeCustomer(session.user.id);

  // Verifica se o payment method pertence ao customer
  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

  if (paymentMethod.customer !== customerId) {
    throw new Error("Método de pagamento não pertence ao usuário");
  }

  // Desanexa o payment method
  await stripe.paymentMethods.detach(paymentMethodId);

  return { success: true };
};
