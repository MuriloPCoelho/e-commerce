"use client";
import StickyActionButtons from "./sticky-action-buttons";

interface ProductActionsWrapperProps {
  productVariantSizeId: number | null;
  children: React.ReactNode;
}

const ProductActionsWrapper = ({
  productVariantSizeId,
  children,
}: ProductActionsWrapperProps) => {
  return (
    <>
      {children}
      <StickyActionButtons
        targetElementId="product-action-buttons"
        productVariantSizeId={productVariantSizeId}
      />
    </>
  );
};

export default ProductActionsWrapper;
