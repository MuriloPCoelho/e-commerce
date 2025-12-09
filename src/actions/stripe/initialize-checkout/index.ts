"use server";

import { BagWithItemsAndTotal, getBag } from "@/actions/get-bag";
import { createPaymentIntent } from "../create-payment-intent";
import { createCustomerSession } from "../create-customer-session";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getAllUserAddresses } from "@/actions/addresses/get-all-user-addresses";
import { db } from "@/db";
import { bagsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const initializeCheckout = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  let bag: BagWithItemsAndTotal;

  try {
    bag = await getBag();
  } catch (error) {
    console.error("Error fetching bag:", error);
    throw error;
  }

  if (bag.totalPriceInCents <= 0) {
    throw new Error("Bag is empty");
  }

  if (!bag.userAddressId) {
    try {
      const userAddresses = await getAllUserAddresses(session.user.id);
      const defaultAddress = userAddresses.find((addr) => addr.isDefault);

      if (defaultAddress) {
        await db.update(bagsTable).set({ userAddressId: defaultAddress.id }).where(
          eq(bagsTable.id, bag.id)
        );
      }
    } catch (error) {
      console.error("Error setting default address for bag:", error);
      throw error;
    }
  }

  let paymentIntent = await createPaymentIntent(
    bag.id,
    bag.totalPriceInCents,
    `Payment of the user ${"Murilo"}`
  );

  const customerSession = await createCustomerSession();

  return {
    clientSecret: paymentIntent.client_secret,
    customerSessionSecret: customerSession.client_secret,
  };
};
