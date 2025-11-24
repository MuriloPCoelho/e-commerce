"use client";
import { PaymentElement } from "@stripe/react-stripe-js";

const PaymentSection = () => {
  return (
    <div className="bg-white p-4 rounded-xs">
      <div className="flex justify-between mb-3">
        <h4 className="font-semibold text-lg">Payment</h4>
      </div>
      <div>
        <form>
          <PaymentElement 
            options={{
              layout: {
                type: 'accordion',
              },
              fields: {
                billingDetails: {
                  address: {
                    country: 'never',
                  },
                  name: "auto"
                }
              },
              terms: {
                card: 'never',
              },
            }}
          />
        </form>
      </div>
    </div>
  );
};

export default PaymentSection;
