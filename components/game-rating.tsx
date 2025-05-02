import { Star, StarHalf, Users } from "lucide-react";

interface GameRatingProps {
  average: number;
  count: number;
  size?: "sm" | "md" | "lg";
}

export default function GameRating({
  average,
  count,
  size = "md",
}: GameRatingProps) {
  // Convert average to stars (full, half, empty)
  const fullStars = Math.floor(average);
  const hasHalfStar = average % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  // Size classes
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className="flex items-center">
      <div className="flex">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className={`${sizeClasses[size]} text-retro-orange dark:text-dark-orange fill-current`}
          />
        ))}

        {/* Half star */}
        {hasHalfStar && (
          <StarHalf
            className={`${sizeClasses[size]} text-retro-orange dark:text-dark-orange fill-current`}
          />
        )}

        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={`${sizeClasses[size]} text-gray-300 dark:text-gray-600`}
          />
        ))}
      </div>

      <div
        className={`ml-2 flex items-center ${textSizeClasses[size]} text-retro-secondary dark:text-dark-secondary`}>
        <span className="font-medium">
          {average > 0 ? average.toFixed(1) : "N/A"}
        </span>
        <span className="mx-1">•</span>
        <Users className={`${sizeClasses[size]} mr-1`} />
        <span>{count}</span>
      </div>
    </div>
  );
}
