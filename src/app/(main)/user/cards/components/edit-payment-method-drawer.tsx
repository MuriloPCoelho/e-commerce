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
import { Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { updatePaymentMethod } from "@/actions/stripe/update-payment-method";
import Stripe from "stripe";

interface EditPaymentMethodDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  paymentMethod: Stripe.PaymentMethod;
}

const EditPaymentMethodDrawer = ({
  isOpen,
  onOpenChange,
  paymentMethod,
}: EditPaymentMethodDrawerProps) => {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const [cardholderName, setCardholderName] = useState(
    paymentMethod.billing_details.name || ""
  );
  const [expMonth, setExpMonth] = useState(
    paymentMethod.card?.exp_month.toString() || ""
  );
  const [expYear, setExpYear] = useState(
    paymentMethod.card?.exp_year.toString() || ""
  );
  const [error, setError] = useState<string | null>(null);

  const updateCardMutation = useMutation({
    mutationFn: (data: {
      paymentMethodId: string;
      cardholderName?: string;
      expMonth?: number;
      expYear?: number;
    }) => updatePaymentMethod(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payment-methods", session?.user?.stripeCustomerId],
      });
      onOpenChange(false);
      setError(null);
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Error updating card");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!cardholderName.trim()) {
      setError("Please enter the cardholder's name");
      return;
    }

    const monthNum = parseInt(expMonth);
    const yearNum = parseInt(expYear);

    if (
      isNaN(monthNum) ||
      monthNum < 1 ||
      monthNum > 12
    ) {
      setError("Please enter a valid month (1-12)");
      return;
    }

    if (isNaN(yearNum) || yearNum < new Date().getFullYear()) {
      setError("Please enter a valid year");
      return;
    }

    updateCardMutation.mutate({
      paymentMethodId: paymentMethod.id,
      cardholderName: cardholderName.trim(),
      expMonth: monthNum,
      expYear: yearNum,
    });
  };

  const handleCancel = () => {
    setCardholderName(paymentMethod.billing_details.name || "");
    setExpMonth(paymentMethod.card?.exp_month.toString() || "");
    setExpYear(paymentMethod.card?.exp_year.toString() || "");
    setError(null);
    onOpenChange(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-xl">Edit Card</DrawerTitle>
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
              disabled={updateCardMutation.isPending}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Expiration Month
              </label>
              <Input
                type="number"
                placeholder="MM"
                min="1"
                max="12"
                value={expMonth}
                onChange={(e) => setExpMonth(e.target.value)}
                disabled={updateCardMutation.isPending}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Expiration Year
              </label>
              <Input
                type="number"
                placeholder="YYYY"
                min={new Date().getFullYear()}
                value={expYear}
                onChange={(e) => setExpYear(e.target.value)}
                disabled={updateCardMutation.isPending}
                required
              />
            </div>
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
              onClick={handleCancel}
              disabled={updateCardMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateCardMutation.isPending}>
              {updateCardMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Card"
              )}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default EditPaymentMethodDrawer;
