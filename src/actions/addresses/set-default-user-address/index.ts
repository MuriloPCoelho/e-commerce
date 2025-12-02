"use server";

import { db } from "@/db";
import { userAddressesTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";

export const setDefaultUserAddress = async (addressId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) throw new Error("Unauthorized");

  await db
    .update(userAddressesTable)
    .set({ isDefault: false })
    .where(
      and(
        eq(userAddressesTable.userId, session?.user?.id),
        eq(userAddressesTable.isDefault, true)
      )
    );

  await db
    .update(userAddressesTable)
    .set({ isDefault: true })
    .where(
      and(
        eq(userAddressesTable.userId, session?.user?.id),
        eq(userAddressesTable.id, addressId)
      )
    );

  return { success: true };
};
