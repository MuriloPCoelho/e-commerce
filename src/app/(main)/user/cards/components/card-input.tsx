"use client"
import { CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";

const CardInput = () => {
  const [isCardFocused, setIsCardFocused] = useState(false);
  const [cardError, setCardError] = useState(false);
  return (
    <div
      className={`flex items-center h-10 w-full rounded-md border bg-transparent dark:bg-input/30 px-3 py-1 shadow-xs transition-[color,box-shadow] ${
        isCardFocused
          ? "border-ring ring-ring/50 ring-[3px]"
          : cardError
          ? "border-destructive ring-destructive/20 ring-[3px]"
          : "border-input"
      }`}
    >
      <CardElement
        onFocus={() => setIsCardFocused(true)}
        onBlur={() => setIsCardFocused(false)}
        onChange={(e) => setCardError(!e.complete && e.error !== undefined)}
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#0a0a0a",
              fontFamily: "inherit",
              "::placeholder": {
                color: "#737373",
              },
            },
            invalid: {
              color: "#dc2626",
            },
          },
          hidePostalCode: true,
        }}
        className="w-full"
      />
    </div>
  );
};

export default CardInput;
