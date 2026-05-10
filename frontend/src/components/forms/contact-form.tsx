"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Enter a valid email address."),
  company: z.string().optional(),
  message: z.string().min(20, "Please tell us a bit more so we can help well."),
});

type ContactInput = z.infer<typeof contactSchema>;

export function ContactForm() {
  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        const subject = encodeURIComponent(`BookShore support request from ${values.name}`);
        const body = encodeURIComponent(
          [
            `Name: ${values.name}`,
            `Email: ${values.email}`,
            values.company ? `Company: ${values.company}` : "",
            "",
            values.message,
          ].filter(Boolean).join("\n"),
        );
        window.open(`mailto:hello@bookshore.dev?subject=${subject}&body=${body}`, "_self");
        toast.success("Opening your email app to send the message.");
        form.reset();
      })}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Input placeholder="Your name" {...form.register("name")} />
          {form.formState.errors.name ? <p className="mt-2 text-xs text-[var(--secondary)]">{form.formState.errors.name.message}</p> : null}
        </div>
        <div>
          <Input placeholder="Email address" {...form.register("email")} />
          {form.formState.errors.email ? <p className="mt-2 text-xs text-[var(--secondary)]">{form.formState.errors.email.message}</p> : null}
        </div>
      </div>
      <Input placeholder="Company or team (optional)" {...form.register("company")} />
      <div>
        <Textarea placeholder="Tell us what you need help with" {...form.register("message")} />
        {form.formState.errors.message ? (
          <p className="mt-2 text-xs text-[var(--secondary)]">{form.formState.errors.message.message}</p>
        ) : null}
      </div>
      <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}
