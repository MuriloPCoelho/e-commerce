"use client";
import BagItem from "@/components/commom/bag-item";
import { useBag } from "@/providers/bag-provider";

const OrderSummary = () => {
  const { bag } = useBag();

  if (!bag) return <p>Loading...</p>;

  return (
    <div className="bg-white p-4 rounded-xs">
      <h4 className="font-semibold text-lg mb-3">Summary</h4>

      {bag.items.length === 0 ? (
        <p className="text-sm text-neutral-500">Your bag is empty</p>
      ) : (
        <div className="space-y-4">
          {bag.items.map((item) => {
            console.log("Rendering item:", item);
            return <BagItem key={item.id} item={item} />;
          })}
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
