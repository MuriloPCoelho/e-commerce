"use server";

import { db } from "@/db";
import { bagItemsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export const removeBagProduct = async (bagItemId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) throw new Error("Unauthorized");
  const userId = session.user.id;

  const bagItem = await db.query.bagItemsTable.findFirst({
    where: (bagItem, { eq }) =>
      eq(bagItem.id, bagItemId),
  });

  if (!bagItem) throw new Error("Bag item not found");

  const bag = await db.query.bagsTable.findFirst({
    where: (bag, { eq }) =>
      eq(bag.id, bagItem.bagId) &&
      eq(bag.userId, userId),
  });

  if (!bag) throw new Error("Bag not found");

  await db.delete(bagItemsTable).where(
    eq(bagItemsTable.id, bagItemId)
  );

  // await db.delete(bagItemsTable).where(bagItemsTable.id.equals(bagItemId)).execute();
}