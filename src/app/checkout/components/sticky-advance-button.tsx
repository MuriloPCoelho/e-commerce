"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { useBag } from "@/providers/bag-provider";
import { centsToReais } from "@/lib/utils";
import Image from "next/image";

const StickyAdvanceButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { bag } = useBag();

  if (!bag) return null;

  const subtotal = bag.items.reduce((total, item) => {
    const price = item.productVariantSize?.variant.priceInCents ?? 0;
    return total + price * item.quantity;
  }, 0);

  const shipping = 0; // Pode ser calculado
  const total = subtotal + shipping;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 shadow-lg">
        <div className="p-4">
          <Button className="w-full" size="lg" onClick={() => setIsOpen(true)}>
            Proceed
          </Button>
        </div>
      </div>

      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-xl">Order Confirmation</DrawerTitle>
          </DrawerHeader>

          <div className="px-4 pb-6 max-h-[60vh] overflow-y-auto">
            {/* Order Items */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Items ({bag.items.length})</h3>
              <div className="space-y-3">
                {bag.items.map((item) => {
                  const variant = item.productVariantSize?.variant;
                  const product = variant?.product;
                  const size = item.productVariantSize?.size;
                  
                  if (!variant || !product || !size) {
                    console.log('Missing data for item:', item);
                    return (
                      <div key={item.id} className="text-xs text-red-500">
                        Item data incomplete
                      </div>
                    );
                  }

                  return (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={variant.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{product.name}</h4>
                        <p className="text-xs text-neutral-600">
                          {variant.name} • Size {size.name}
                        </p>
                        <p className="text-xs text-neutral-600">Qty: {item.quantity}</p>
                        <p className="font-semibold text-sm mt-1">
                          {centsToReais(variant.priceInCents * item.quantity)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6 pb-6 border-b">
              <h3 className="font-semibold mb-2">Payment Method</h3>
              <p className="text-sm text-neutral-600">Card ending in ••••</p>
            </div>

            {/* Delivery Address */}
            <div className="mb-6 pb-6 border-b">
              <h3 className="font-semibold mb-2">Delivery Address</h3>
              <div className="text-sm text-neutral-600">
                <p>Not selected</p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-medium">{centsToReais(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Shipping</span>
                <span className="font-medium">{shipping === 0 ? "Free" : centsToReais(shipping)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span>{centsToReais(total)}</span>
              </div>
            </div>
          </div>

          <DrawerFooter className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              // Lógica de confirmação do pedido
              console.log("Order confirmed");
            }}>
              Confirm
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default StickyAdvanceButton;
