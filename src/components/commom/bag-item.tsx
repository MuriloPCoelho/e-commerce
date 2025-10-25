import Image from "next/image";
import QuantitySelector from "./quantity-selector";
import { centsToReais } from "@/lib/utils";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import colors from "tailwindcss/colors";

interface BagItemProps {
  imageUrl: string;
  productName: string;
  color: string;
  size: string;
  priceInCents: number;
}

const BagItem = ({
  imageUrl,
  productName,
  color,
  size,
  priceInCents,
}: BagItemProps) => {
  return (
    <div className="grid grid-cols-[80px_1fr] gap-2 px-4">
      <div className="aspect-square relative rounded-xs">
        <Image
          src={imageUrl}
          alt={productName}
          fill
          className="object-top rounded-xs te"
        />
      </div>
      <div className="grid grid-cols-2 grid-rows-[auto_auto_1fr] text-xs">
        <div className="font-medium truncate text-ellipsis col-span-2 flex justify-between">
          {`${productName} - ${color}`}
        <Button variant="ghost" size="xs" className="w-7">
          <Trash size={16} color={colors.red[600]} />
        </Button>
          </div>
        <div className="text-neutral-600 text-xs col-span-2 ">
          Tamanho: {size}
        </div>
        <div className="content-center">
          <div className="font-semibold">
            {centsToReais(priceInCents)}
          </div>
        </div>
        <div className="place-self-end">
          <QuantitySelector />
        </div>
      </div>
    </div>
  );
};

export default BagItem;
