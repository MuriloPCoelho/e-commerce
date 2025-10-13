import { Star, StarHalf } from "lucide-react";

interface ProductRatingProps {
  rating: number; // Valor de 0 a 5
}

const ProductRating = ({ rating }: ProductRatingProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars > 0;

  return (
    <div className="flex items-center gap-1">
      <div className="relative">
        <div className="stars flex">
          {Array.from({ length: 5 }, (_, index) => (
            <Star fill="oklch(92.2% 0 0)" strokeWidth={0} key={index} size={16} />
          ))}
        </div>
        <div className="flex absolute top-0">
          {Array.from({ length: fullStars }, (_, index) => (
            <Star
              color="oklch(85.2% 0.199 91.936)"
              fill="oklch(85.2% 0.199 91.936)"
              strokeWidth={1}
              size={16}
              key={index}
            />
          ))}
          {hasHalfStar && (
            <StarHalf
              color="oklch(85.2% 0.199 91.936)"
              fill="oklch(85.2% 0.199 91.936)"
              strokeWidth={1}
              size={16}
            />
          )}
        </div>
      </div>
      <span className="text-sm text-neutral-500 tracking-wide">
        {`(${rating.toFixed(1)})`}
      </span>
    </div>
  );
};

export default ProductRating;
