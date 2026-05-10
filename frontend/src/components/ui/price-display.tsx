import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";

type PriceDisplayProps = {
  price: number;
  compareAtPrice?: number | null;
  className?: string;
  size?: "sm" | "md" | "lg";
  freeShipping?: boolean;
};

const amountSizes = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
};

export function PriceDisplay({
  price,
  compareAtPrice,
  className,
  size = "md",
  freeShipping = false,
}: PriceDisplayProps) {
  const savings = compareAtPrice ? compareAtPrice - price : 0;

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <div className="flex items-end gap-2">
        <span className={cn("font-semibold text-[var(--foreground)]", amountSizes[size])}>
          {formatCurrency(price)}
        </span>
        {compareAtPrice ? (
          <span className="pb-1 text-sm text-[var(--muted-foreground)] line-through">
            {formatCurrency(compareAtPrice)}
          </span>
        ) : null}
      </div>
      {savings > 0 ? <Badge variant="secondary">Save {formatCurrency(savings)}</Badge> : null}
      {freeShipping ? <Badge variant="outline">Free shipping</Badge> : null}
    </div>
  );
}
