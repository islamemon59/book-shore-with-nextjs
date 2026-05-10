import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-28 w-full rounded-[calc(var(--radius)-0.28rem)] border bg-white/72 px-4 py-3 text-sm shadow-[var(--shadow-sm)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(212,175,55,0.12)]",
      className,
    )}
    {...props}
  />
));

Textarea.displayName = "Textarea";
