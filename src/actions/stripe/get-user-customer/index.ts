"use server";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Busca o Stripe Customer ID de um usuário
 * Retorna o customerId se existir, caso contrário retorna null
 */
export const getUserStripeCustomer = async (userId: string) => {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, userId),
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  return user.stripeCustomerId;
};
