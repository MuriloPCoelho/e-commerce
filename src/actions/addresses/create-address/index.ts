"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { CreateAddressSchema, createAddressSchema } from "./schema";
import { db } from "@/db";
import { userAddressesTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { success } from "zod";

export const createAddress = async (data: CreateAddressSchema) => {
  createAddressSchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) throw new Error("Unauthorized");

  if (data.isDefault) {
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
      userId: session.user.id,
    })
    .returning();

  revalidatePath("/user/addresses");

  return { success: true};
};
