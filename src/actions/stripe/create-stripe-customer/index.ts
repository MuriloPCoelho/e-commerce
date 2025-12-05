"use server";

import { stripe } from "@/lib/stripe/client";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const createStripeCustomer = async (userId: string) => {
  if (!userId) throw new Error("Invalid operation");

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) throw new Error("User not authenticated");
  if (session.user.id !== userId) throw new Error("User not authorized");

  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, userId),
  });

  if (!user) throw new Error("Invalid operation");

  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  if (!user.email || !user.email.includes("@"))
    throw new Error("Invalid email");

  try {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: {
        userId: user.id,
      },
    });

    await db
      .update(usersTable)
      .set({ stripeCustomerId: customer.id })
      .where(eq(usersTable.id, user.id));

    return customer.id;
  } catch (error) {
    console.error("Error creating Stripe customer:", error);
    throw new Error("Failed to create Stripe customer");
  }
};
