"use client";
import { Elements } from "@stripe/react-stripe-js";
import AddressSection from "./components/address-section";
import DeliverySection from "./components/delivery-section";
import OrderSummary from "./components/order-summary";
import PaymentSection from "./components/payment-section";
import StickyAdvanceButton from "./components/sticky-advance-button";
import { loadStripe } from "@stripe/stripe-js";
import { createPaymentIntent } from "@/actions/stripe/create-payment-intent";
import { createCustomerSession } from "@/actions/stripe/create-customer-session";
import { useBag } from "@/providers/bag-provider";
import { useEffect, useState } from "react";
import Loading from "./loading";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const CheckoutPage = () => {
  const [clientSecret, setClientSecret] = useState<string | null>("");
  const [customerSessionSecret, setCustomerSessionSecret] = useState<string | null>("");
  const { bag } = useBag();

  useEffect(() => {
    if (!bag) return;
    
    const initiatePayment = async () => {
      const [paymentIntent, customerSession] = await Promise.all([
        createPaymentIntent(
          bag.id,
          bag.totalPriceInCents,
          `Payment of the user ${"Murilo"}`
        ),
        createCustomerSession(),
      ]);
      
      setClientSecret(paymentIntent.client_secret);
      setCustomerSessionSecret(customerSession.client_secret);
    };

    initiatePayment();
  }, [bag?.id, bag?.totalPriceInCents]);

  if (!bag) return <Loading />;

  return (
    <>
      <div className="grid p-4 gap-4 pb-24">
        <OrderSummary />
        {clientSecret && customerSessionSecret && (
          <Elements
            stripe={stripePromise}
            options={{ 
            clientSecret: clientSecret,
            customerSessionClientSecret: customerSessionSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#353535',
                colorBackground: '#ffffff', 
                colorText: '#252525', 
                colorDanger: '#dc2626',
                fontFamily: 'Geist, sans-serif, helvetica, arial',
                spacingUnit: '4px',
                borderRadius: '0.375rem',
                fontSizeBase: '14px',
                colorTextSecondary: '#8e8e8e',
                colorTextPlaceholder: '#8e8e8e',
              },
              rules: {
                '.Input': {
                  border: '1px solid #ebebeb',
                  boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                  padding: '9px 12px',
                  height: '40px',
                  fontSize: '14px',
                  lineHeight: '20px',
                  backgroundColor: 'transparent',
                  transition: 'color 150ms, box-shadow 150ms',
                  boxSizing: 'border-box',
                },
                '.Input:focus': {
                  border: '1px solid #b5b5b5',
                  boxShadow: '0 0 0 3px rgba(181, 181, 181, 0.5)', 
                  outline: 'none',
                },
                '.Input::placeholder': {
                  color: '#8e8e8e',
                },
                '.Label': {
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#252525',
                },
                '.Error': {
                  fontSize: '14px',
                  color: '#dc2626', 
                },
                '.RadioIcon': {
                  width: '16px'
                }
              }
            }
          }}
        >
          <PaymentSection />
        </Elements>
      )}
      <AddressSection />
      <DeliverySection />
      </div>
      <StickyAdvanceButton />
    </>
  );
};

export default CheckoutPage;
