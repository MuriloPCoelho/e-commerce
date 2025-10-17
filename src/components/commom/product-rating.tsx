import { Star } from "lucide-react";
import { twJoin } from "tailwind-merge";

interface ProductRatingProps {
  rating: number; // Valor de 0 a 5
  size?: "sm" | "md" | "lg";
}

const ProductRating = ({ rating, size = "md" }: ProductRatingProps) => {
  const sizeNumber = size === "sm" ? 12 : size === "md" ? 16 : 20;

  return (
    <div className={twJoin("flex items-center gap-1", size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-lg")}>
      <span className="">{`${rating.toFixed(1)}`}</span>
      <Star fill="oklch(85.2% 0.199 91.936)" strokeWidth={0} size={sizeNumber} />
      <span className="text-neutral-500">{`(${Math.floor(Math.random() * 1000)} avaliações)`}</span>
    </div>
  );
};

export default ProductRating;
