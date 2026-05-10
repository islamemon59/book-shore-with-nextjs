import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-[calc(var(--radius)-0.28rem)] text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[0_18px_42px_-24px_rgba(30,58,95,0.72)] hover:-translate-y-0.5 hover:shadow-[0_24px_48px_-24px_rgba(30,58,95,0.82)]",
        secondary:
          "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-[0_14px_30px_-20px_rgba(212,175,55,0.6)] hover:-translate-y-0.5 hover:opacity-95",
        outline:
          "border bg-white/75 text-[var(--foreground)] shadow-[var(--shadow-sm)] hover:-translate-y-0.5 hover:bg-white hover:shadow-[var(--shadow-md)]",
        ghost: "text-[var(--foreground)] hover:bg-[var(--muted)]/80",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
