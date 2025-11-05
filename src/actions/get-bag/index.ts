"use server";

import { db } from "@/db";
import { bagsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const getBag = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) throw new Error("Unauthorized");

  const bag = await db.query.bagsTable.findFirst({
    where: (bag, { eq }) => eq(bag.userId, session.user.id),
    with: {
      items: {
        with: {
          productVariantSize: {
            with: {
              variant: {
                with: {
                  product: true,
                },
              },
              size: true,
            },
          },
        },
      },
    },
  });

  if (!bag) {
    const [newBag] = await db
      .insert(bagsTable)
      .values({
        userId: session.user.id,
      })
      .returning();

    return {
      ...newBag,
      items: [],
      totalPriceInCents: 0,
    };
  }

  return {
    ...bag,
    totalPriceInCents: bag.items.reduce((total, item) => {
      const priceInCents = item.productVariantSize?.variant.priceInCents;
      return total + (priceInCents ?? 0) * item.quantity;
    }, 0),
  };
};
