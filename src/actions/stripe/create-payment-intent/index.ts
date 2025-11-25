"use server";

import { stripe, getOrCreateStripeCustomer } from "@/lib/stripe";
import { db } from "@/db";
import { bagsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const createPaymentIntent = async (
  bagId: string,
  amount: number,
  description: string
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado");
  }

  const customerId = await getOrCreateStripeCustomer(session.user.id);

  const bag = await db.query.bagsTable.findFirst({
    where: eq(bagsTable.id, bagId),
  });

  if (!bag) {
    throw new Error("Bag not found");
  }

  if (bag.paymentIntentId) {
    try {
      const existingIntent = await stripe.paymentIntents.retrieve(
        bag.paymentIntentId
      );

      if (existingIntent.amount !== amount) {
        const updatedIntent = await stripe.paymentIntents.update(
          bag.paymentIntentId,
          {
            amount,
            description,
          }
        );

        return {
          client_secret: updatedIntent.client_secret,
          payment_intent_id: updatedIntent.id,
        };
      }

      return {
        client_secret: existingIntent.client_secret,
        payment_intent_id: existingIntent.id,
      };
    } catch (error) {
      console.error("Error retrieving payment intent:", error);
    }
  }

  const paymentIntent = await stripe.paymentIntents.create(
    {
      amount,
      currency: "BRL",
      description,
      customer: customerId,
      setup_future_usage: "off_session",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        bagId,
      },
    },
    {
      idempotencyKey: `bag_${bagId}_${Date.now()}`,
    }
  );

  await db
    .update(bagsTable)
    .set({ paymentIntentId: paymentIntent.id })
    .where(eq(bagsTable.id, bagId));

  return {
    client_secret: paymentIntent.client_secret,
    payment_intent_id: paymentIntent.id,
  };
};
