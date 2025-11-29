"use server";

import { db } from "@/db";
import { userAddressesTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

export async function getAddress(addressId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session?.user) throw new Error("Unauthorized");

  const address = await db.query.userAddressesTable.findFirst({
    where: and(
      eq(userAddressesTable.id, addressId),
      eq(userAddressesTable.userId, session.user.id)
    ),
  });

  if (!address) throw new Error("Address not found");
  return address;
}
