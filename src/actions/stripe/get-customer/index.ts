"use server";

import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export const getCustomer = async (customerId : string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session?.user) {
    throw new Error("Usuário não autenticado");
  }

  if (!customerId) {
    throw new Error("Customer ID não encontrado para o usuário");
  }

  const customer = await stripe.customers.retrieve(customerId);

  return JSON.parse(JSON.stringify(customer));
}
