"use client";

import { centsToReais } from "@/lib/utils";
import { Progress } from "../ui/progress";
import { twJoin } from "tailwind-merge";

const FreeShippingProgress = ({ subtotal }: { subtotal: number }) => {
  const freeShippingThresholdInCents = 29990;
  const progress = Math.min(
    (subtotal / freeShippingThresholdInCents) * 100,
    100
  );

  return (
    <div>
      <Progress
        value={progress}
        className={twJoin(
          "mb-2",
          subtotal >= freeShippingThresholdInCents ? "*:bg-emerald-400" : ""
        )}
      />
      <p className="text-center text-xs">
        {subtotal < freeShippingThresholdInCents
          ? `Faltam ${centsToReais(
              freeShippingThresholdInCents - subtotal
            )} para
          frete grátis!`
          : "Você ganhou frete grátis! 🎉"}
      </p>
    </div>
  );
};

export default FreeShippingProgress;
