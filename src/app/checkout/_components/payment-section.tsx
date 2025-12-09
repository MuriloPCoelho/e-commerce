"use client";
import { PaymentElement } from "@stripe/react-stripe-js";

const PaymentSection = () => {
  return (
    <div className="bg-white p-4 rounded">
      <div className="flex justify-between mb-3">
        <h4 className="font-semibold text-lg">Payment</h4>
      </div>
      <div>
        <PaymentElement
          options={{
            layout: {
              type: "accordion",
              radios: true,
              spacedAccordionItems: false,
            },
            fields: {
              billingDetails: {
                address: {
                  country: "never",
                },
                name: "auto",
              },
            },
            terms: {
              card: "auto",
            },
          }}
        />
      </div>
    </div>
  );
};

export default PaymentSection;
