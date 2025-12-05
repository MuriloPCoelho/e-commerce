"use server";

import { stripe } from "@/lib/stripe/client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Stripe from "stripe";

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

  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  if (!session?.user?.stripeCustomerId) {
    throw new Error("User does not have an associated Stripe customer");
  }

  if (expMonth !== undefined) {
    if (!Number.isInteger(expMonth) || expMonth < 1 || expMonth > 12) {
      throw new Error("Invalid expiration month");
    }
  }

  if (expYear !== undefined) {
    const currentYear = new Date().getFullYear();
    if (
      !Number.isInteger(expYear) ||
      expYear < currentYear ||
      expYear > currentYear + 20
    ) {
      throw new Error("Invalid expiration year");
    }
  }

  let paymentMethod: Stripe.PaymentMethod;
  try {
    paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
  } catch (error) {
    throw new Error("Payment method not found");
  }

  if (paymentMethod.customer !== session.user.stripeCustomerId)
    throw new Error("Payment method does not belong to the user");

  if (paymentMethod.type !== "card")
    throw new Error("Only card payment methods can be updated");

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

  try {
    await stripe.paymentMethods.update(paymentMethodId, updateData);
    return { success: true };
  } catch (error) {
    console.error("Error updating payment method:", error);
    throw new Error("Failed to update payment method");
  }
};
