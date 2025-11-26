"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import AddPaymentMethodDrawer from "./components/add-payment-method-drawer";
import PaymentCard from "./components/payment-card";
import { getMyPaymentMethods } from "@/actions/stripe/get-customer-payment-methods";
import { createCustomerSession } from "@/actions/stripe/create-customer-session";
import { authClient } from "@/lib/auth-client";
import { getCustomer } from "@/actions/stripe/get-customer";
import { useQuery } from "@tanstack/react-query";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CardsPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { data: session } = authClient.useSession();

  const { data: paymentData, isLoading } = useQuery({
    queryKey: ["payment-methods", session?.user?.stripeCustomerId],
    queryFn: async () => {
      const methods = await getMyPaymentMethods();
      const customer = await getCustomer(session?.user.stripeCustomerId!);
      return {
        methods,
        defaultPaymentMethodId:
          customer.invoice_settings.default_payment_method || null,
      };
    },
    enabled: !!session?.user?.stripeCustomerId,
  });

  const { data: customerSessionSecret } = useQuery({
    queryKey: ["customer-session", session?.user?.stripeCustomerId],
    queryFn: async () => {
      const { client_secret } = await createCustomerSession();
      return client_secret;
    },
    enabled: !!session?.user?.stripeCustomerId,
  });

  return (
    <div className="py-1">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Cards</h1>
        <Button
          onClick={() => setIsDrawerOpen(true)}
          variant="link"
          className="underline"
          size="xs"
        >
          <span>Add Card</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : !paymentData?.methods || paymentData.methods.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            You don't have any saved cards yet.
          </p>
          <Button onClick={() => setIsDrawerOpen(true)}>
            <Plus />
            <span>Add your first card</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {paymentData.methods.map((method) => (
            <PaymentCard
              key={method.id}
              paymentMethod={method}
              isDefault={method.id === paymentData.defaultPaymentMethodId}
              ownerName={method.billing_details.name || session?.user?.name || ""}
            />
          ))}
        </div>
      )}

      {customerSessionSecret && (
        <Elements
          stripe={stripePromise}
          options={{
            customerSessionClientSecret: customerSessionSecret,
          }}
        >
          <AddPaymentMethodDrawer
            isOpen={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
          />
        </Elements>
      )}
    </div>
  );
}
