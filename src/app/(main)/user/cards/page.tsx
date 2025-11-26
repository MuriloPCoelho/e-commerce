"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import AddPaymentMethodDrawer from "./components/add-payment-method-drawer";
import PaymentCard from "./components/payment-card";
import { getMyPaymentMethods } from "@/actions/stripe/get-customer-payment-methods";
import { setDefaultPaymentMethod } from "@/actions/stripe/set-default-payment-method";
import { removePaymentMethod } from "@/actions/stripe/remove-payment-method";
import { createCustomerSession } from "@/actions/stripe/create-customer-session";
import { authClient } from "@/lib/auth-client";
import { getCustomer } from "@/actions/stripe/get-customer";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CardsPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [customerSessionSecret, setCustomerSessionSecret] = useState<
    string | null
  >(null);
  const { data: session } = authClient.useSession();
  const [defaultPaymentMethodId, setDefaultPaymentMethodId] = useState<
    string | null
  >(null);

  const loadPaymentMethods = async () => {
    try {
      setIsLoading(true);
      const methods = await getMyPaymentMethods();
      const customer = await getCustomer(session?.user.stripeCustomerId!);

      setDefaultPaymentMethodId(
        customer.invoice_settings.default_payment_method || null
      );
      setPaymentMethods(methods);
    } catch (error) {
      console.error("Error loading cards:", error);
      setPaymentMethods([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCustomerSession = async () => {
    try {
      const { client_secret } = await createCustomerSession();
      setCustomerSessionSecret(client_secret);
    } catch (error) {
      console.error("Error loading customer session:", error);
    }
  };

  useEffect(() => {
    if (session?.user?.stripeCustomerId) {
      loadPaymentMethods();
      loadCustomerSession();
    }
  }, [session?.user?.stripeCustomerId]);

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
      ) : paymentMethods.length === 0 ? (
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
          {paymentMethods.map((method) => (
            <PaymentCard
              key={method.id}
              paymentMethod={method}
              isDefault={method.id === defaultPaymentMethodId}
              ownerName={method.billing_details.name}
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
            onSuccess={loadPaymentMethods}
          />
        </Elements>
      )}
    </div>
  );
}
