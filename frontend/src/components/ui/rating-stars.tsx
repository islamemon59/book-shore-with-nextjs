import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type RatingStarsProps = {
  rating: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
};

const sizeClasses = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export function RatingStars({
  rating,
  count,
  size = "md",
  showValue = true,
  className,
}: RatingStarsProps) {
  const fullStars = Math.round(rating);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={cn(
              sizeClasses[size],
              index < fullStars ? "fill-[var(--accent)] text-[var(--accent)]" : "text-[var(--border)]",
            )}
          />
        ))}
      </div>
      {showValue ? (
        <span className="text-sm font-medium text-[var(--foreground)]">
          {rating.toFixed(1)}
          {typeof count === "number" ? (
            <span className="ml-1 text-[var(--muted-foreground)]">({count.toLocaleString()})</span>
          ) : null}
        </span>
      ) : null}
    </div>
  );
}
