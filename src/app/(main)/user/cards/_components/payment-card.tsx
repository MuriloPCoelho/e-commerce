"use client";

import { EllipsisVertical, Star, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CardBrandIcon from "@/components/commom/card-brand-icon";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";
import { removePaymentMethod } from "@/actions/stripe/remove-payment-method";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import Stripe from "stripe";
import { setDefaultPaymentMethod } from "@/actions/stripe/set-default-payment-method";
import EditPaymentMethodDrawer from "./edit-payment-method-drawer";

interface PaymentCardProps {
  paymentMethod: Stripe.PaymentMethod;
  isDefault?: boolean;
  ownerName: string;
}

const PaymentCard = ({
  paymentMethod,
  isDefault,
  ownerName,
}: PaymentCardProps) => {
  const [open, setOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();

  const removeCardMutation = useMutation({
    mutationFn: (paymentMethodId: string) =>
      removePaymentMethod(paymentMethodId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payment-methods", session?.user?.stripeCustomerId],
      });
      setOpen(false);
      setShowDeleteConfirm(false);
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setShowDeleteConfirm(false);
    }
  };

  if (!paymentMethod.card) {
    return null;
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const isExpired =
    paymentMethod.card.exp_year < currentYear ||
    (paymentMethod.card.exp_year === currentYear &&
      paymentMethod.card.exp_month < currentMonth);

  const setCardAsDefaultMutation = useMutation({
    mutationFn: (paymentMethodId: string) =>
      setDefaultPaymentMethod(paymentMethodId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payment-methods", session?.user?.stripeCustomerId],
      });
      setOpen(false);
    },
  });

  const handleSetCardAsDefault = () => {
    setCardAsDefaultMutation.mutate(paymentMethod.id);
  };

  const handleEditCard = () => {
    setShowEditDrawer(true);
    setOpen(false);
  };

  const handleRemoveCard = () => {
    setShowDeleteConfirm(true);
  };

  const confirmRemoveCard = () => {
    removeCardMutation.mutate(paymentMethod.id);
  };

  const cancelRemove = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="border rounded-lg p-3 flex justify-between text-xs">
      <div className="flex items-center gap-3">
        <div>
          <CardBrandIcon brand={paymentMethod.card.brand} size={40} />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-sm">{ownerName}</span>
          </div>
          <p className=" text-gray-600">
            <span className="uppercase">{paymentMethod.card.brand}</span> ending
            in {paymentMethod.card.last4}
          </p>
          <p className="text-xs text-gray-500">
            Expires {paymentMethod.card.exp_month.toString().padStart(2, "0")}/
            {paymentMethod.card.exp_year}
          </p>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <div>
            {isExpired ? (
              <Badge variant="secondary" className="bg-red-50 text-red-600">
                Expired
              </Badge>
            ) : (
              isDefault && (
                <Badge variant="secondary" className="bg-blue-50 text-blue-600">
                  Default
                </Badge>
              )
            )}
          </div>
          <Drawer open={open} onOpenChange={handleOpenChange}>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="xs" title="Card Options">
                <EllipsisVertical />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="pb-2">
                <DrawerTitle className="text-center">
                  <span className="uppercase">{paymentMethod.card.brand}</span>{" "}
                  •••• {paymentMethod.card.last4}
                </DrawerTitle>
              </DrawerHeader>

              {!showDeleteConfirm ? (
                <div className="flex flex-col p-4 pt-0 gap-3 pb-8">
                  {!isExpired && !isDefault && (
                    <button
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
                      onClick={handleSetCardAsDefault}
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                        <Star className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium text-base">Set as Default</p>
                        <p className="text-sm text-gray-500">
                          Use this card for future purchases
                        </p>
                      </div>
                    </button>
                  )}
                  {!isExpired && (
                    <button
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
                      onClick={handleEditCard}
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                        <Pencil className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium text-base">Edit Card</p>
                        <p className="text-sm text-gray-500">
                          Update card information
                        </p>
                      </div>
                    </button>
                  )}
                  <button
                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-red-50 active:bg-red-100 transition-colors"
                    onClick={handleRemoveCard}
                  >
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                      <Trash2 className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-medium text-base text-red-600">
                        Remove Card
                      </p>
                      <p className="text-sm text-gray-500">
                        Delete this card from your account
                      </p>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="p-4 pb-8">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                      <Trash2 className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Remove Card?</h3>
                    <p className="text-sm text-gray-600">
                      This action cannot be undone. The card ending in{" "}
                      {paymentMethod.card.last4} will be permanently removed
                      from your account.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={cancelRemove}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={confirmRemoveCard}
                    >
                      Remove Card
                    </Button>
                  </div>
                </div>
              )}
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      <EditPaymentMethodDrawer
        isOpen={showEditDrawer}
        onOpenChange={setShowEditDrawer}
        paymentMethod={paymentMethod}
      />
    </div>
  );
};

export default PaymentCard;
