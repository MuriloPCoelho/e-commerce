"use client";

import { CreditCard, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PaymentMethodCardProps {
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
  onSetDefault?: (id: string) => void;
  onRemove?: (id: string) => void;
}

const PaymentMethodCard = ({
  paymentMethod,
  isDefault,
  onSetDefault,
  onRemove,
}: PaymentMethodCardProps) => {
  const brandNames: Record<string, string> = {
    visa: "Visa",
    mastercard: "Mastercard",
    amex: "American Express",
    discover: "Discover",
    diners: "Diners Club",
    jcb: "JCB",
    unionpay: "UnionPay",
  };

  const brandName = brandNames[paymentMethod.card.brand] || paymentMethod.card.brand.toUpperCase();

  return (
    <div className="border rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <CreditCard className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{brandName}</span>
            {isDefault && <Badge variant="default">Default</Badge>}
          </div>
          <p className="text-sm text-gray-600">
            •••• •••• •••• {paymentMethod.card.last4}
          </p>
          <p className="text-xs text-gray-500">
            Expires {paymentMethod.card.exp_month.toString().padStart(2, "0")}/
            {paymentMethod.card.exp_year}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!isDefault && onSetDefault && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSetDefault(paymentMethod.id)}
          >
            Set as default
          </Button>
        )}
        {onRemove && (
          <Button
            variant="ghost"
            onClick={() => onRemove(paymentMethod.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodCard;
