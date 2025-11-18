import { Star } from "lucide-react";
import Link from "next/link";
import { twJoin } from "tailwind-merge";
import colors from "tailwindcss/colors";

interface ProductRatingProps {
  rating: number; // Valor de 0 a 5
  size?: "sm" | "md" | "lg";
  link?: string;
}

const ProductRating = ({ rating, size = "md", link }: ProductRatingProps) => {
  const sizeNumber = size === "sm" ? 12 : size === "md" ? 16 : 20;

  const content = (
    <div
      className={twJoin(
        "flex items-center gap-1",
        size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-lg"
      )}
    >
      <span className="">{`${rating.toFixed(1)}`}</span>
      <Star fill={colors.amber[400]} strokeWidth={0} size={sizeNumber} />
      <span
        className={twJoin(
          "text-neutral-500",
          link ? "group-hover:underline underline-offset-3" : ""
        )}
      >{`(${Math.floor(Math.random() * 1000)} reviews)`}</span>
    </div>
  );

  return link ? (
    <Link href={link} className="cursor-pointer group">
      {content}
    </Link>
  ) : (
    <>{content}</>
  );
};

export default ProductRating;
