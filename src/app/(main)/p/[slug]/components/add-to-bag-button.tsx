"use client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBag } from "@/providers/bag-provider";
import { useState } from "react";

interface AddToBagButtonProps {
  productVariantSizeId: number | null | undefined;
  variant?: "default" | "outline";
  children?: React.ReactNode;
  redirectToCheckout?: boolean;
  iconOnly?: boolean;
  className?: string;
}

const AddToBagButton = ({
  productVariantSizeId,
  variant = "outline",
  children,
  redirectToCheckout = false,
  iconOnly = false,
  className,
}: AddToBagButtonProps) => {
  const router = useRouter();
  const { addItem } = useBag();
  const [isPending, setIsPending] = useState(false);

  const handleAddToBag = async () => {
    if (!productVariantSizeId) return;
    
    setIsPending(true);
    try {
      await addItem(productVariantSizeId);
      if (redirectToCheckout) {
        router.push("/checkout");
      }
    } catch (error) {
      console.error("Failed to add to bag:", error);
    } finally {
      setIsPending(false);
    }
  };

  const showIcon = !redirectToCheckout || iconOnly;
  const buttonText = children || "Add to bag";

  return (
    <Button
      variant={variant}
      size="lg"
      onClick={handleAddToBag}
      disabled={!productVariantSizeId || isPending}
      className={className}
    >
      {!isPending ? (
        <>
          {showIcon && <ShoppingBag className="size-5" />}
          {!iconOnly && buttonText}
        </>
      ) : (
        <Spinner className="size-5" />
      )}
    </Button>
  );
};

export default AddToBagButton;
