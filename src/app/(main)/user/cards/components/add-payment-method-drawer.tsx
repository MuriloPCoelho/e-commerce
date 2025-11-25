"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { createSetupIntent } from "@/actions/stripe/create-setup-intent";
import { Loader2 } from "lucide-react";
import CardInput from "./card-input";

interface AddPaymentMethodDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const AddPaymentMethodDrawer = ({
  isOpen,
  onOpenChange,
  onSuccess,
}: AddPaymentMethodDrawerProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardholderName, setCardholderName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!cardholderName.trim()) {
      setError("Please enter the cardholder's name");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { client_secret } = await createSetupIntent();

      if (!client_secret) {
        setError("Error creating Setup Intent");
        return;
      }

      const { error: confirmError } = await stripe.confirmCardSetup(
        client_secret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: cardholderName.trim(),
            },
          },
        }
      );

      if (confirmError) {
        setError(confirmError.message || "Error adding card");
        return;
      }

      onSuccess?.();
      onOpenChange(false);
      
      elements.getElement(CardElement)?.clear();
      setCardholderName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error adding card");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-xl">Add Card</DrawerTitle>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="px-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Cardholder Name
            </label>
            <Input
              type="text"
              placeholder="Name as it appears on card"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Card Information
            </label>
            <CardInput />

            <p className="text-xs text-gray-500 mt-2">
              Your card will be validated with 3D Secure authentication
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <DrawerFooter className="grid grid-cols-2 gap-3 px-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!stripe || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Card"
              )}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default AddPaymentMethodDrawer;
