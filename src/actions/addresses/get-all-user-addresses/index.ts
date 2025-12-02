"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { userAddressesTable } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const getAllUserAddresses = async (userId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session.user.id !== userId)
    throw new Error("Unauthorized");

  const addresses = await db.query.userAddressesTable.findMany({
    where: eq(userAddressesTable.userId, userId),
    orderBy: [
      desc(userAddressesTable.isDefault),
      desc(userAddressesTable.createdAt),
    ],
  });

  return addresses;
};
