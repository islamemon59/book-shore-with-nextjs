import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-[calc(var(--radius)-0.28rem)] border bg-white/72 px-4 text-sm text-[var(--foreground)] shadow-[var(--shadow-sm)] outline-none ring-0 placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(212,175,55,0.12)] dark:bg-[rgba(255,255,255,0.08)] dark:focus:bg-[rgba(255,255,255,0.12)]",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
