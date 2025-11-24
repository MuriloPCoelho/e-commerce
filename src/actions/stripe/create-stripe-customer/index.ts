"use server";

import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Cria um novo Stripe Customer para um usuário e salva o ID no banco
 * Retorna o customerId criado
 */
export const createStripeCustomer = async (userId: string) => {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, userId),
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  // Cria novo customer no Stripe
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name,
    metadata: {
      userId: user.id,
    },
  });

  // Salva o customer ID no banco
  await db
    .update(usersTable)
    .set({ stripeCustomerId: customer.id })
    .where(eq(usersTable.id, user.id));

  return customer.id;
};
