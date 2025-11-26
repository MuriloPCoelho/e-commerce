"use server";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";


export const getUserStripeCustomerId = async (userId: string) => {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, userId),
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  return user.stripeCustomerId;
};
