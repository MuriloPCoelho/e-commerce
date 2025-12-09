"use client";
import { Elements } from "@stripe/react-stripe-js";
import AddressSection from "./_components/address-section";
import DeliverySection from "./_components/delivery-section";
import OrderSummary from "./_components/order-summary";
import PaymentSection from "./_components/payment-section";
import StickyAdvanceButton from "./_components/sticky-advance-button";
import { loadStripe } from "@stripe/stripe-js";
import { useInitializeCheckout } from "@/hooks/stripe/use-initialize-checkout";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const CheckoutPage = () => {
  const { data } = useInitializeCheckout();
  
  return (
    <>
      <div className="grid p-2 gap-2 pb-40">
        <OrderSummary />
        {data?.clientSecret && data?.customerSessionSecret && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret: data.clientSecret,
              customerSessionClientSecret: data.customerSessionSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#353535",
                  colorBackground: "#ffffff",
                  colorText: "#252525",
                  colorDanger: "#dc2626",
                  fontFamily: "Geist, sans-serif, helvetica, arial",
                  spacingUnit: "4px",
                  borderRadius: "0.375rem",
                  fontSizeBase: "14px",
                  colorTextSecondary: "#8e8e8e",
                  colorTextPlaceholder: "#8e8e8e",
                },
                rules: {
                  ".Input": {
                    border: "1px solid #ebebeb",
                    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                    padding: "9px 12px",
                    height: "40px",
                    fontSize: "14px",
                    lineHeight: "20px",
                    backgroundColor: "transparent",
                    transition: "color 150ms, box-shadow 150ms",
                    boxSizing: "border-box",
                  },
                  ".Input:focus": {
                    border: "1px solid #b5b5b5",
                    boxShadow: "0 0 0 3px rgba(181, 181, 181, 0.5)",
                    outline: "none",
                  },
                  ".Input::placeholder": {
                    color: "#8e8e8e",
                  },
                  ".Label": {
                    fontSize: "14px",
                    fontWeight: "600",
                    marginBottom: "8px",
                    color: "#252525",
                  },
                  ".Error": {
                    fontSize: "14px",
                    color: "#dc2626",
                  },
                  ".RadioIcon": {
                    width: "16px",
                  },
                },
              },
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
