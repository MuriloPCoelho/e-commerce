"use server";

import { stripe, getOrCreateStripeCustomer } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const createCustomerSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado");
  }

  const customerId = await getOrCreateStripeCustomer(session.user.id);

  const customerSession = await stripe.customerSessions.create({
    customer: customerId,
    components: {
      payment_element: {
        enabled: true,
        features: {
          payment_method_save: "enabled",
          payment_method_save_usage: "off_session",
          payment_method_remove: "enabled",
          payment_method_redisplay: "enabled",
        },
      },
    },
  });

  return {
    client_secret: customerSession.client_secret,
  };
};
