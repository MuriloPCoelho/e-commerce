"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  calculateShipping,
  ShippingOption,
} from "@/actions/calculate-shipping";
import { centsToReais } from "@/lib/utils";
import { useBag } from "@/providers/bag-provider";
import { Truck, Loader2, CheckCircle2 } from "lucide-react";

const DeliverySection = () => {
  const { bag } = useBag();
  const [postalCode, setPostalCode] = useState("");
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasCalculated, setHasCalculated] = useState(false);

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
    if (!bag) return;

    if (postalCode.replace(/\D/g, "").length !== 8) {
      setError("Invalid postal code. Enter 8 digits.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const options = await calculateShipping({
        postalCode,
        productPriceInCents: bag.totalPriceInCents,
      });
      setShippingOptions(options);
      setHasCalculated(true);
      if (options.length > 0) {
        setSelectedOption(options[0].id);
      }
    } catch (err) {
      setError("Error calculating shipping. Try again.");
      setShippingOptions([]);
      setHasCalculated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCalculate();
    }
  };

  const selectedShippingOption = shippingOptions.find(
    (opt) => opt.id === selectedOption
  );

  return (
    <div className="bg-white p-4 rounded-xs">
      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
        <Truck className="size-5" />
        Delivery
      </h4>

      <div className="space-y-4">
        {!hasCalculated ? (
          <div className="space-y-2">
            <Label htmlFor="postal-code" className="text-sm font-medium">
              Enter your postal code
            </Label>
            <div className="flex rounded-md shadow-xs">
              <Input
                id="postal-code"
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
                disabled={
                  isLoading || postalCode.replace(/\D/g, "").length !== 8
                }
                variant="secondary"
                size="md"
                className="rounded-s-none shadow-none"
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
        ) : (
          <>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-600" />
                <span className="text-neutral-600">
                  Postal code: <strong>{postalCode}</strong>
                </span>
              </div>
              <Button
                variant="link"
                size="xs"
                onClick={() => {
                  setHasCalculated(false);
                  setShippingOptions([]);
                  setSelectedOption("");
                }}
                className="h-auto p-0"
              >
                Change
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Delivery options:</p>
              <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                {shippingOptions.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center space-x-3 border rounded-md p-3 hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedOption(option.id)}
                  >
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label
                      htmlFor={option.id}
                      className="flex-1 cursor-pointer flex items-center justify-between"
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
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {selectedShippingOption && (
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Shipping cost:</span>
                  <span className="font-semibold">
                    {selectedShippingOption.price === 0
                      ? "Free"
                      : centsToReais(selectedShippingOption.price)}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DeliverySection;
