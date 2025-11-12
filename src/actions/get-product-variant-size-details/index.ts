"use server";

import { db } from "@/db";

export const getProductVariantSizeDetails = async (productVariantSizeId: number) => {
  const productVariantSize = await db.query.productVariantSizesTable.findFirst({
    where: (pvs, { eq }) => eq(pvs.id, productVariantSizeId),
    with: {
      variant: {
        with: {
          product: true,
        },
      },
      size: true,
    },
  });

  return productVariantSize;
};

export const getMultipleProductVariantSizeDetails = async (productVariantSizeIds: number[]) => {
  const details = await Promise.all(
    productVariantSizeIds.map((id) => getProductVariantSizeDetails(id))
  );

  return details.filter((detail) => detail !== undefined);
};
