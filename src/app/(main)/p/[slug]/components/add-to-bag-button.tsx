"use client";
import { addProductToBag } from "@/actions/add-bag-product";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShoppingBag } from "lucide-react";

interface AddToBagButtonProps {
  productVariantSizeId: number | null | undefined;
}

const AddToBagButton = ({ productVariantSizeId }: AddToBagButtonProps) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["addProductToBag", productVariantSizeId],
    mutationFn: async () => {
      if (!productVariantSizeId) throw new Error("No size selected");
      return addProductToBag({ productVariantSizeId });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["bag"] });
    },
    onError: (err) => {
      console.error("Failed to add to bag", err);
    },
  });

  return (
    <Button
      className="w-full"
      variant="outline"
      size="lg"
      onClick={() => mutate()}
      disabled={!productVariantSizeId || isPending}
    >
      {
        !isPending ? <ShoppingBag className="size-5" /> : <Spinner className="size-5" />
      }
      
      Adicionar a sacola
    </Button>
  );
};

export default AddToBagButton;
