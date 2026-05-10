import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
  {
  variants: {
    variant: {
        default: "border-transparent bg-[var(--secondary)] text-[var(--secondary-foreground)]",
        secondary: "border-transparent bg-[var(--accent)] text-[var(--accent-foreground)]",
        outline: "bg-white/40 text-[var(--foreground)]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export function Badge({
  className,
  variant,
  ...props
}: HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
