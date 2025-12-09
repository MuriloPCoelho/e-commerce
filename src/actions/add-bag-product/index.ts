"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AddProductToBagSchema, addProductToBagSchema } from "./schema";
import { db } from "@/db";
import { bagItemsTable, bagsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const addProductToBag = async (data: AddProductToBagSchema) => {
  addProductToBagSchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) throw new Error("Unauthorized");

  const productVariantSize = await db.query.productVariantSizesTable.findFirst({
    where: (productVariantSizeId, { eq }) =>
      eq(productVariantSizeId.id, data.productVariantSizeId),
  });

  if (!productVariantSize) throw new Error("Product variant size not found");

  if (productVariantSize.stock <= 0) throw new Error("Product out of stock");

  const bag = await db.query.bagsTable.findFirst({
    where: (bag, { eq }) => eq(bag.userId, session.user.id),
  });

  let bagId = bag?.id;
  if (!bag) {
    const userAddresses = await db.query.userAddressesTable.findMany({
      where: (address, { eq }) => eq(address.userId, session.user.id),
    });

    let addressId: string | undefined;
    
    if (userAddresses.length === 1) {
      addressId = userAddresses[0].id;
    } else if (userAddresses.length > 1) {
      const defaultAddress = userAddresses.find((addr) => addr.isDefault);
      addressId = defaultAddress?.id;
    }

    const [newBag] = await db
      .insert(bagsTable)
      .values({
        userId: session.user.id,
        userAddressId: addressId,
      })
      .returning();

    bagId = newBag.id;
  }

  if (!bagId) throw new Error("Bag ID is required");

  const bagItem = await db.query.bagItemsTable.findFirst({
    where: (bagItem, { eq, and }) =>
      and(
        eq(bagItem.bagId, bagId),
        eq(bagItem.productVariantSizeId, data.productVariantSizeId)
      ),
    with: {
      bag: {
        columns: { userId: true },
      },
    },
  });

  if (bagItem && bagItem.bag.userId === session.user.id) {
    await db
      .update(bagItemsTable)
      .set({
        quantity: bagItem.quantity + 1,
      })
      .where(eq(bagItemsTable.id, bagItem.id));

    return;
  }

  await db.insert(bagItemsTable).values({
    bagId: bagId,
    productVariantSizeId: data.productVariantSizeId,
    quantity: 1,
  });
};
