"use server";

import { db } from "@/db";
import { bagsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { updateBagShippingSchema, UpdateBagShippingSchema } from "./schema";

export const updateBagShipping = async (data: UpdateBagShippingSchema) => {
  const validatedData = updateBagShippingSchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) throw new Error("Unauthorized");

  const [updatedBag] = await db
    .update(bagsTable)
    .set({
      shippingMethod: validatedData.shippingMethod,
      shippingPriceInCents: validatedData.shippingPriceInCents,
    })
    .where(eq(bagsTable.userId, session.user.id))
    .returning();

  if (!updatedBag) throw new Error("Bag not found");

  return updatedBag;
};
