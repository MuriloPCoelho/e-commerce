"use server";


import { auth } from "@/lib/auth";
import { getOrCreateStripeCustomer, stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export const addCustomerPaymentMethod = async (
  paymentMethodId: string,
  setAsDefault: boolean = false
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  let customerId = await getOrCreateStripeCustomer(session.user.id);

  if (!paymentMethodId || typeof paymentMethodId !== "string") {
    throw new Error("Invalid payment method ID");
  }

  if (!paymentMethodId.startsWith("pm_")) {
    throw new Error("Invalid payment method ID format");
  }

  let paymentMethod: Stripe.PaymentMethod;
  try {
    paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
  } catch (error) {
    throw new Error("Failed to attach payment method");
  }

  if (setAsDefault) {
    try {
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
    } catch (error) {
      throw new Error("Failed to update default payment method");
    }
  }

  return paymentMethod;
};
