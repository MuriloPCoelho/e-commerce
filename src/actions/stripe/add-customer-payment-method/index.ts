"use server";

import { stripe, getOrCreateStripeCustomer } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const addCustomerPaymentMethod = async (
  paymentMethodId: string,
  setAsDefault: boolean = false
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado");
  }

  const customerId = await getOrCreateStripeCustomer(session.user.id);

  const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customerId,
  });

  if (setAsDefault) {
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
  }

  return paymentMethod;
};