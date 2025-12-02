"use server";

import { db } from "@/db";
import { userAddressesTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { updateAddressSchema } from "./schema";

export async function updateUserAddress(input: unknown) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const data = updateAddressSchema.parse(input);

  if (data.isDefault) {
    await db
      .update(userAddressesTable)
      .set({ isDefault: false })
      .where(and(eq(userAddressesTable.userId, session.user.id)));
  }

  await db
    .update(userAddressesTable)
    .set({
      label: data.label,
      recipientName: data.recipientName,
      phone: data.phone,
      street: data.street,
      number: data.number,
      complement: data.complement,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      isDefault: !!data.isDefault,
    })
    .where(
      and(
        eq(userAddressesTable.id, data.id),
        eq(userAddressesTable.userId, session.user.id)
      )
    );

  return { success: true };
}
