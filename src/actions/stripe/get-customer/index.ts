"use server";

import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe/client";
import { headers } from "next/headers";

export const getCustomer = async (customerId: string) => {
  if (!customerId) throw new Error("Customer ID é obrigatório");

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) throw new Error("Usuário não autenticado");

  if (session.user.stripeCustomerId !== customerId)
    throw new Error("Customer ID não encontrado para o usuário");

  const customer = await stripe.customers.retrieve(customerId);

  return JSON.parse(JSON.stringify(customer));
};
