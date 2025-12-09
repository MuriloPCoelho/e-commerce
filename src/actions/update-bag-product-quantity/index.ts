"use server";

import { db } from "@/db";
import { bagItemsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import {
  UpdateBagProductQuantitySchema,
  updateBagProductQuantitySchema,
} from "./schema";

export const updateBagProductQuantity = async (
  data: UpdateBagProductQuantitySchema
) => {
  updateBagProductQuantitySchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Unauthorized");
  const userId = session.user.id;

  const bagItem = await db.query.bagItemsTable.findFirst({
    where: (bagItem, { eq }) => eq(bagItem.id, data.bagItemId),
    with: {
      bag: {
        columns: {
          userId: true,
        },
      },
      productVariantSize: {
        columns: {
          stock: true,
        },
      },
    },
  });

  if (!bagItem) throw new Error("Bag item not found");
  if (bagItem.bag.userId !== userId) throw new Error("Unauthorized");

  if (!bagItem.productVariantSize) {
    throw new Error("Product variant size not found");
  }

  if (data.quantity > bagItem.productVariantSize.stock) {
    throw new Error(
      `Only ${bagItem.productVariantSize.stock} items available in stock`
    );
  }

  await db
    .update(bagItemsTable)
    .set({ quantity: data.quantity })
    .where(eq(bagItemsTable.id, data.bagItemId));

  return { success: true };
};
