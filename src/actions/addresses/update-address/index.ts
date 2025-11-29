"use server";

import { db } from "@/db";
import { userAddressesTable } from "@/db/schema";
import { updateAddressSchema } from "./schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

export async function updateAddress(input: unknown) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const data = updateAddressSchema.parse(input);

  // Se for setar como default, remove o default dos outros
  if (data.isDefault) {
    await db
      .update(userAddressesTable)
      .set({ isDefault: false })
      .where(and(eq(userAddressesTable.userId, session.user.id)));
  }

  const [updated] = await db
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
    .where(and(eq(userAddressesTable.id, data.id), eq(userAddressesTable.userId, session.user.id)))
    .returning();

  return updated;
}
