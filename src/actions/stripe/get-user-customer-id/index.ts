"use server";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export const getUserStripeCustomerId = async (userId: string) => {
  if (!userId) throw new Error("userId is required");

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) throw new Error("User not authenticated");

  if (session.user.id !== userId)
    throw new Error("User ID does not match the authenticated user");

  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, userId),
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user.stripeCustomerId;
};
