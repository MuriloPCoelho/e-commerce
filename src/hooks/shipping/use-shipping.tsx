"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: number;
}

interface ShippingContextValue {
  shippingOptions: ShippingOption[];
  selectedOption: string;
  setShippingOptions: (options: ShippingOption[]) => void;
  setSelectedOption: (optionId: string) => void;
  getSelectedShippingPrice: () => number;
}

const ShippingContext = createContext<ShippingContextValue | undefined>(
  undefined
);

export function ShippingProvider({ children }: { children: ReactNode }) {
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");

  const getSelectedShippingPrice = () => {
    const option = shippingOptions.find((opt) => opt.id === selectedOption);
    return option?.price ?? 0;
  };

  const value = {
    shippingOptions,
    selectedOption,
    setShippingOptions,
    setSelectedOption,
    getSelectedShippingPrice,
  };

  return (
    <ShippingContext.Provider value={value}>
      {children}
    </ShippingContext.Provider>
  );
}

export function useShipping() {
  const context = useContext(ShippingContext);
  if (!context) {
    throw new Error("useShipping must be used within ShippingProvider");
  }
  return context;
}

