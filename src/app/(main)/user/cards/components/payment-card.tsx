"use client";

import { EllipsisVertical, Star, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CardBrandIcon from "@/components/commom/card-brand-icon";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";

interface PaymentCardProps {
  paymentMethod: {
    id: string;
    card: {
      brand: string;
      last4: string;
      exp_month: number;
      exp_year: number;
    };
  };
  isDefault?: boolean;
  ownerName: string;
}

const PaymentCard = ({
  paymentMethod,
  isDefault,
  ownerName,
}: PaymentCardProps) => {
  const [open, setOpen] = useState(false);

  const handleSetAsDefault = () => {
    // TODO: Implementar lógica para definir como padrão
    console.log("Set as default:", paymentMethod.id);
    setOpen(false);
  };

  const handleEditCard = () => {
    // TODO: Implementar lógica para editar cartão
    console.log("Edit card:", paymentMethod.id);
    setOpen(false);
  };

  const handleRemoveCard = () => {
    // TODO: Implementar lógica para remover cartão
    console.log("Remove card:", paymentMethod.id);
    setOpen(false);
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
            {isDefault && (
              <Badge variant="secondary" className="bg-blue-600 text-white">
                Default
              </Badge>
            )}
          </div>
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="xs" title="Card Options">
                <EllipsisVertical />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="pb-2">
                <DrawerTitle className="text-center">
                  <span className="uppercase">{paymentMethod.card.brand}</span> •••• {paymentMethod.card.last4}
                </DrawerTitle>
              </DrawerHeader>
              <div className="flex flex-col p-4 pt-0 gap-3 pb-8">
                {!isDefault && (
                  <button
                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
                    onClick={handleSetAsDefault}
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
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;
