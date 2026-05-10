"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { SocialSigninButtons } from "./social-signin-buttons";

const registerSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Include at least one uppercase letter.")
    .regex(/[0-9]/, "Include at least one number."),
  confirmPassword: z.string().min(8, "Confirm your password."),
  agreeToTerms: z.boolean().refine((value) => value, "Please agree to the terms."),
}).refine((values) => values.password === values.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type RegisterInput = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: true,
    },
  });

  const password = useWatch({
    control: form.control,
    name: "password",
  }) ?? "";
  const passwordStrength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  }, [password]);

  return (
    <div className="card-surface p-8">
      <div className="mb-8 space-y-3">
        <div className="eyebrow">Create your account</div>
        <h1 className="font-serif text-4xl font-semibold">Join BookShore</h1>
        <p className="text-sm leading-7 text-[var(--muted-foreground)]">
          Save your reading preferences, manage orders, and unlock AI-powered discovery and support inside a more intentional reader account.
        </p>
        <div className="inline-flex items-center gap-2 rounded-full border bg-white/65 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
          <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
          Personalized shelves await
        </div>
      </div>

      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(async (values) => {
          try {
            const { error } = await authClient.signUp.email({
              name: values.name,
              email: values.email,
              password: values.password,
              callbackURL: "/dashboard",
            });

            if (error) {
              throw new Error(error.message || "Unable to create your account.");
            }

            toast.success("Account created. Welcome to BookShore.");
            router.push("/dashboard");
            router.refresh();
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to create your account.");
          }
        })}
      >
        <div>
          <label className="mb-2 block text-sm font-medium">Full name</label>
          <Input placeholder="Full name" {...form.register("name")} />
          {form.formState.errors.name ? <p className="mt-2 text-xs text-[var(--danger)]">{form.formState.errors.name.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Email</label>
          <Input placeholder="Email address" {...form.register("email")} />
          {form.formState.errors.email ? <p className="mt-2 text-xs text-[var(--danger)]">{form.formState.errors.email.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              className="pr-12"
              {...form.register("password")}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--primary)]"
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--muted)]">
            <div
              className={`h-full rounded-full ${
                passwordStrength >= 4
                  ? "bg-[var(--success)]"
                  : passwordStrength >= 2
                    ? "bg-[var(--warning)]"
                    : "bg-[var(--danger)]"
              }`}
              style={{ width: `${(passwordStrength / 4) * 100}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-[var(--muted-foreground)]">Use 8+ characters, one uppercase letter, and one number.</div>
          {form.formState.errors.password ? <p className="mt-2 text-xs text-[var(--danger)]">{form.formState.errors.password.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Confirm password</label>
          <Input type={showPassword ? "text" : "password"} placeholder="Confirm your password" {...form.register("confirmPassword")} />
          {form.formState.errors.confirmPassword ? <p className="mt-2 text-xs text-[var(--danger)]">{form.formState.errors.confirmPassword.message}</p> : null}
        </div>
        <label className="flex items-start gap-3 rounded-[calc(var(--radius)-0.3rem)] border bg-white/55 px-4 py-3 text-sm">
          <input type="checkbox" className="mt-1" {...form.register("agreeToTerms")} />
          <span>I agree to the terms, privacy commitments, and reader account policies.</span>
        </label>
        {form.formState.errors.agreeToTerms ? <p className="mt-2 text-xs text-[var(--danger)]">{form.formState.errors.agreeToTerms.message}</p> : null}
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <div className="mt-4 rounded-[calc(var(--radius)-0.3rem)] border bg-white/55 p-4 text-sm text-[var(--muted-foreground)]">
        <div className="inline-flex items-center gap-2 font-semibold text-[var(--foreground)]">
          <Check className="h-4 w-4 text-[var(--success)]" />
          Reader benefits
        </div>
        <p className="mt-2 leading-7">
          Save favorite genres, unlock AI-guided suggestions, track orders, and build a more personal reading dashboard.
        </p>
      </div>

      <div className="my-6 text-center text-sm text-[var(--muted-foreground)]">or continue with</div>
      <SocialSigninButtons />

      <p className="mt-6 text-sm text-[var(--muted-foreground)]">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[var(--primary)]">
          Sign in here
        </Link>
      </p>
    </div>
  );
}
