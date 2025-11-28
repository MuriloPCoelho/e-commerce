"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  calculateShipping,
  ShippingOption,
} from "@/actions/calculate-shipping";
import { centsToReais } from "@/lib/utils";
import { Truck, Loader2 } from "lucide-react";

interface ShippingCalculatorProps {
  productPriceInCents: number;
}

export default function ShippingCalculator({ productPriceInCents }: ShippingCalculatorProps) {
  const [postalCode, setPostalCode] = useState("");
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const formatPostalCode = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 5) {
      return numbers;
    }
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPostalCode(e.target.value);
    setPostalCode(formatted);
    setError("");
  };

  const handleCalculate = async () => {
    if (postalCode.replace(/\D/g, "").length !== 8) {
      setError("Invalid postal code. Enter 8 digits.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const options = await calculateShipping({ postalCode, productPriceInCents });
      setShippingOptions(options);
    } catch (err) {
      setError("Error calculating shipping. Try again.");
      setShippingOptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCalculate();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <Truck className="size-4" />
          Calculate Shipping
        </label>
        <div className="flex rounded-md shadow-xs">
          <Input
            type="text"
            placeholder="00000-000"
            value={postalCode}
            onChange={handlePostalCodeChange}
            onKeyDown={handleKeyDown}
            maxLength={9}
            disabled={isLoading}
            className="-me-px rounded-e-none shadow-none focus-visible:z-10"
            inputMode="numeric"
          />
          <Button
            onClick={handleCalculate}
            disabled={isLoading || postalCode.replace(/\D/g, "").length !== 8}
            variant="outline"
            size="md"
            className="rounded-s-none rounded-e-md shadow-none bg-neutral-100 border-neutral-300 hover:bg-neutral-200"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Calculate"
            )}
          </Button>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      {shippingOptions.length > 0 && (
        <div className="space-y-2 border-t pt-4">
          <p className="text-sm font-medium">Delivery options:</p>
          <div className="space-y-2">
            {shippingOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{option.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {option.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {option.price === 0
                      ? "Free"
                      : centsToReais(option.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
