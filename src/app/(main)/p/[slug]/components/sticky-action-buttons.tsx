"use client";
import { useEffect, useState } from "react";
import AddToBagButton from "./add-to-bag-button";

interface StickyActionButtonsProps {
  targetElementId: string;
  productVariantSizeId: number | null | undefined;
}

const StickyActionButtons = ({
  targetElementId,
  productVariantSizeId,
}: StickyActionButtonsProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const targetElement = document.getElementById(targetElementId);
    if (!targetElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Mostra os botões fixos quando os botões originais NÃO estão visíveis
        setIsVisible(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: "0px",
      }
    );

    observer.observe(targetElement);

    return () => {
      observer.disconnect();
    };
  }, [targetElementId]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 shadow-lg">
      <div className="grid grid-cols-[1fr_auto] gap-2 p-4">
        <AddToBagButton
          productVariantSizeId={productVariantSizeId}
          variant="default"
          redirectToCheckout
          className="w-full"
        >
          Buy now
        </AddToBagButton>
        <AddToBagButton
          productVariantSizeId={productVariantSizeId}
          iconOnly
        />
      </div>
    </div>
  );
};

export default StickyActionButtons;
