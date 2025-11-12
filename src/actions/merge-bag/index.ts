"use server";

import { db } from "@/db";
import { bagItemsTable, bagsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { LocalBagItem } from "@/types/bag";

interface MergeBagInput {
  localBagItems: LocalBagItem[];
}

export const mergeBag = async ({ localBagItems }: MergeBagInput) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (!localBagItems || localBagItems.length === 0) {
    return;
  }

  let bag = await db.query.bagsTable.findFirst({
    where: (bag, { eq }) => eq(bag.userId, session.user.id),
    with: {
      items: true,
    },
  });

  let bagId: string;

  if (!bag) {
    const [newBag] = await db
      .insert(bagsTable)
      .values({
        userId: session.user.id,
      })
      .returning();
    bagId = newBag.id;
  } else {
    bagId = bag.id;
  }

  for (const localItem of localBagItems) {
    const productVariantSize =
      await db.query.productVariantSizesTable.findFirst({
        where: (pvs, { eq }) => eq(pvs.id, localItem.productVariantSizeId),
      });

    if (!productVariantSize) {
      console.warn(
        `Product variant size ${localItem.productVariantSizeId} not found, skipping`
      );
      continue;
    }

    if (productVariantSize.stock <= 0) {
      console.warn(
        `Product variant size ${localItem.productVariantSizeId} out of stock, skipping`
      );
      continue;
    }

    const existingBagItem = await db.query.bagItemsTable.findFirst({
      where: (item, { eq, and }) =>
        and(
          eq(item.bagId, bagId),
          eq(item.productVariantSizeId, localItem.productVariantSizeId)
        ),
    });

    if (existingBagItem) {
      const newQuantity = Math.min(
        existingBagItem.quantity + localItem.quantity,
        productVariantSize.stock
      );

      await db
        .update(bagItemsTable)
        .set({ quantity: newQuantity })
        .where(eq(bagItemsTable.id, existingBagItem.id));
    } else {
      const quantityToAdd = Math.min(
        localItem.quantity,
        productVariantSize.stock
      );

      await db.insert(bagItemsTable).values({
        bagId,
        productVariantSizeId: localItem.productVariantSizeId,
        quantity: quantityToAdd,
      });
    }
  }
};
