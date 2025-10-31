"use client";
import { addProductToBag } from "@/actions/add-bag-product";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

interface AddToBagButtonProps {
  productVariantSizeId: number | null | undefined;
  variant?: "default" | "outline";
  children?: React.ReactNode;
  redirectToCheckout?: boolean;
  iconOnly?: boolean;
  className?: string;
}

export const useAddToBag = (
  productVariantSizeId: number | null | undefined,
  redirectToCheckout?: boolean
) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationKey: ["addProductToBag", productVariantSizeId],
    mutationFn: async () => {
      if (!productVariantSizeId) throw new Error("No size selected");
      return addProductToBag({ productVariantSizeId });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["bag"] });
      if (redirectToCheckout) {
        router.push("/checkout");
      }
    },
    onError: (err) => {
      console.error("Failed to add to bag", err);
    },
  });
};

const AddToBagButton = ({
  productVariantSizeId,
  variant = "outline",
  children,
  redirectToCheckout = false,
  iconOnly = false,
  className,
}: AddToBagButtonProps) => {
  const { mutate, isPending } = useAddToBag(
    productVariantSizeId,
    redirectToCheckout
  );

  const showIcon = !redirectToCheckout || iconOnly;
  const buttonText = children || "Adicionar a sacola";

  return (
    <Button
      variant={variant}
      size="lg"
      onClick={() => mutate()}
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
