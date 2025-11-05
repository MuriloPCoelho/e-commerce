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
    where: (bagItem, { eq }) => eq(bagItem.id, bagItemId),
    with: {
      bag: {
        columns: {
          userId: true,
        },
      },
    },
  });

  const cartDoesNotExist = !bagItem;
  const userIsNotOwner = bagItem?.bag.userId !== userId;

  if (cartDoesNotExist) throw new Error("Bag item not found");

  if (userIsNotOwner) throw new Error("Unauthorized");

  await db.delete(bagItemsTable).where(eq(bagItemsTable.id, bagItemId));
};
