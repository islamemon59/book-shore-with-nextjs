"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});

type NewsletterInput = z.infer<typeof newsletterSchema>;

export function NewsletterForm() {
  const form = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row"
      onSubmit={form.handleSubmit(async (values) => {
        const subject = encodeURIComponent("BookShore newsletter subscription");
        const body = encodeURIComponent(`Please add ${values.email} to the BookShore newsletter.`);
        window.open(`mailto:hello@bookshore.dev?subject=${subject}&body=${body}`, "_self");
        toast.success("Opening your email app to finish the subscription.");
        form.reset();
      })}
    >
      <div className="flex-1">
        <Input placeholder="Enter your email" {...form.register("email")} />
        {form.formState.errors.email ? (
          <p className="mt-2 text-xs text-[var(--secondary)]">{form.formState.errors.email.message}</p>
        ) : null}
      </div>
      <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Joining..." : "Join newsletter"}
      </Button>
    </form>
  );
}
