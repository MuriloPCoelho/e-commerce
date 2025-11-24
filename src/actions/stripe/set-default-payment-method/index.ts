"use server";

import { stripe, getOrCreateStripeCustomer } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Define um método de pagamento como padrão para o customer
 */
export const setDefaultPaymentMethod = async (paymentMethodId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado");
  }

  const customerId = await getOrCreateStripeCustomer(session.user.id);

  // Atualiza o customer para definir o método de pagamento padrão
  await stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });

  return { success: true };
};
