"use server";

import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface UpdatePaymentMethodParams {
  paymentMethodId: string;
  cardholderName?: string;
  expMonth?: number;
  expYear?: number;
}

export const updatePaymentMethod = async ({
  paymentMethodId,
  cardholderName,
  expMonth,
  expYear,
}: UpdatePaymentMethodParams) => {
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

  const updateData: any = {};

  if (cardholderName !== undefined) {
    updateData.billing_details = {
      name: cardholderName,
    };
  }

  if (expMonth !== undefined || expYear !== undefined) {
    updateData.card = {};
    if (expMonth !== undefined) {
      updateData.card.exp_month = expMonth;
    }
    if (expYear !== undefined) {
      updateData.card.exp_year = expYear;
    }
  }

  await stripe.paymentMethods.update(
    paymentMethodId,
    updateData
  );

  return { success: true };
};
