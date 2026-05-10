"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LockKeyhole, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { SocialSigninButtons } from "./social-signin-buttons";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Enter your password."),
});

type LoginInput = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div className="card-surface p-8">
      <div className="mb-8 space-y-3">
        <div className="eyebrow">Welcome back, reader</div>
        <h1 className="font-serif text-4xl font-semibold">Sign in to BookShore</h1>
        <p className="text-sm leading-7 text-[var(--muted-foreground)]">
          Access your orders, saved shelves, AI recommendations, and dashboard workspace with your email and password.
        </p>
        <div className="inline-flex items-center gap-2 rounded-full border bg-white/65 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
          <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
          Secure reader access
        </div>
      </div>

      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(async (values) => {
          try {
            const { error } = await authClient.signIn.email({
              email: values.email,
              password: values.password,
            });

            if (error) {
              throw new Error(error.message || "Unable to sign in.");
            }

            toast.success("Welcome back.");
            router.push("/dashboard");
            router.refresh();
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to sign in.");
          }
        })}
      >
        <div>
          <label className="mb-2 block text-sm font-medium">Email</label>
          <Input placeholder="reader@bookshore.dev" {...form.register("email")} />
          {form.formState.errors.email ? <p className="mt-2 text-xs text-[var(--danger)]">{form.formState.errors.email.message}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Password"
              className="pr-12"
              {...form.register("password")}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--primary)]"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {form.formState.errors.password ? <p className="mt-2 text-xs text-[var(--danger)]">{form.formState.errors.password.message}</p> : null}
        </div>

        <div>
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </div>
      </form>

      <div className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
        <LockKeyhole className="h-4 w-4 text-[var(--primary)]" />
        Password sign-in is enabled.
      </div>

      <div className="my-6 text-center text-sm text-[var(--muted-foreground)]">or continue with</div>
      <SocialSigninButtons />

      <p className="mt-6 text-sm text-[var(--muted-foreground)]">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-[var(--primary)]">
          Create one here
        </Link>
      </p>
    </div>
  );
}
