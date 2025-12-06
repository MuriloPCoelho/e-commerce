"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { userAddressesTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { CreateAddressSchema, createAddressSchema } from "./schema";

export const createUserAddress = async (data: CreateAddressSchema) => {
  createAddressSchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) throw new Error("Unauthorized");

  const existingAddresses = await db.query.userAddressesTable.findFirst({
    where: (address) => eq(address.userId, session.user.id),
  });

  const isFirstAddress = !existingAddresses;
  const shouldBeDefault = isFirstAddress || data.isDefault;

  if (shouldBeDefault) {
    await db
      .update(userAddressesTable)
      .set({ isDefault: false })
      .where(
        and(
          eq(userAddressesTable.userId, session.user.id),
          eq(userAddressesTable.isDefault, true)
        )
      );
  }

  await db
    .insert(userAddressesTable)
    .values({
      ...data,
      isDefault: shouldBeDefault,
      userId: session.user.id,
    })
    .returning();

  revalidatePath("/user/addresses");

  return { success: true};
};
