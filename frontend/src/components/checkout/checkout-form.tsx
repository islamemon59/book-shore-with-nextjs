"use client";

import Image from "next/image";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, CreditCard, PackageCheck, Truck } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { checkoutPayloadSchema, type CheckoutPayload } from "@/lib/checkout";
import { clientFetch } from "@/lib/client-api";
import type { CartResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProgressStepper } from "@/components/ui/progress-stepper";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";

type CheckoutFormProps = {
  cart: CartResponse;
  paymentEnabled: boolean;
  user: {
    name: string;
    email: string;
  };
};

export function CheckoutForm({ cart, paymentEnabled, user }: CheckoutFormProps) {
  const [shippingMethod, setShippingMethod] = useState("standard");
  const form = useForm<CheckoutPayload>({
    resolver: zodResolver(checkoutPayloadSchema),
    mode: "onBlur",
    defaultValues: {
      notes: "",
      shippingAddress: {
        fullName: user.name ?? "",
        email: user.email ?? "",
        phone: "",
        country: "United States",
        city: "",
        addressLine1: "",
        addressLine2: "",
        postalCode: "",
      },
    },
  });

  const paymentMutation = useMutation({
    mutationFn: async (payload: CheckoutPayload) =>
      clientFetch<{ url: string }>("/api/checkout/session", {
        method: "POST",
        body: payload,
        target: "same-origin",
      }),
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Unable to start payment.");
    },
  });

  const onSubmit = (payload: CheckoutPayload) => {
    paymentMutation.mutate(payload);
  };

  const values = useWatch({
    control: form.control,
  });
  const isBusy = paymentMutation.isPending;
  const previewItems = cart.items.slice(0, 2);

  return (
    <div className="space-y-6">
      <ProgressStepper
        steps={[
          { label: "Shipping", description: "Address and delivery method", state: "current" },
            { label: "Payment", description: "SSLCommerz confirmation", state: "upcoming" },
          { label: "Confirmation", description: "Order and tracking details", state: "upcoming" },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-[1.08fr,0.92fr]">
        <form className="card-surface soft-panel p-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="eyebrow">Shipping details</div>
          <h2 className="mt-3 font-serif text-3xl font-semibold">Where should we send this order?</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              { label: "Full name", key: "shippingAddress.fullName" as const, placeholder: "Full name" },
              { label: "Email", key: "shippingAddress.email" as const, placeholder: "Email address" },
              { label: "Phone", key: "shippingAddress.phone" as const, placeholder: "Phone number" },
              { label: "Country", key: "shippingAddress.country" as const, placeholder: "Country" },
            ].map((field) => (
              <div key={field.key} className="space-y-2">
                <label className="text-sm font-medium">{field.label}</label>
                <Input {...form.register(field.key)} placeholder={field.placeholder} />
                <p className="text-xs text-[var(--danger)]">
                  {form.formState.errors.shippingAddress?.[field.key.split(".")[1] as keyof CheckoutPayload["shippingAddress"]]?.message}
                </p>
              </div>
            ))}

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Address line 1</label>
              <Input {...form.register("shippingAddress.addressLine1")} placeholder="Street address" />
              <p className="text-xs text-[var(--danger)]">{form.formState.errors.shippingAddress?.addressLine1?.message}</p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Address line 2</label>
              <Input {...form.register("shippingAddress.addressLine2")} placeholder="Apartment, suite, or floor" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <Input {...form.register("shippingAddress.city")} placeholder="City" />
              <p className="text-xs text-[var(--danger)]">{form.formState.errors.shippingAddress?.city?.message}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Postal code</label>
              <Input {...form.register("shippingAddress.postalCode")} placeholder="Postal code" />
              <p className="text-xs text-[var(--danger)]">{form.formState.errors.shippingAddress?.postalCode?.message}</p>
            </div>
          </div>

          <div className="mt-6 rounded-[calc(var(--radius)-0.25rem)] border bg-white/62 p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Shipping method
            </div>
            <div className="mt-4 grid gap-3">
              {[
                {
                  id: "standard",
                  title: "Standard shipping",
                  cost: cart.summary.shippingFee === 0 ? "FREE" : formatCurrency(cart.summary.shippingFee),
                  eta: "2-5 business days",
                },
                {
                  id: "priority",
                  title: "Priority shipping",
                  cost: formatCurrency(14.5),
                  eta: "1-2 business days",
                },
              ].map((option) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-center justify-between rounded-[calc(var(--radius)-0.3rem)] border px-4 py-4 ${
                    shippingMethod === option.id ? "border-[var(--accent)] bg-[var(--secondary)]" : "bg-white/65"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={shippingMethod === option.id}
                      onChange={() => setShippingMethod(option.id)}
                    />
                    <div>
                      <div className="font-semibold">{option.title}</div>
                      <div className="text-sm text-[var(--muted-foreground)]">{option.eta}</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">{option.cost}</div>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <label className="text-sm font-medium">Order notes</label>
            <Textarea
              {...form.register("notes")}
              className="min-h-32"
              placeholder="Gift message, delivery note, or anything the store team should know."
            />
          </div>

          <div className="mt-6 rounded-[calc(var(--radius)-0.25rem)] border bg-white/80 p-4 text-sm text-[var(--muted-foreground)]">
            {paymentEnabled
              ? "You will be redirected to the secure SSLCommerz hosted payment page to finish the order."
              : "SSLCommerz checkout is not enabled for this environment yet."}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {!paymentEnabled ? (
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/cart">Back to cart</Link>
              </Button>
            ) : (
              <Button type="submit" className="w-full sm:w-auto" disabled={isBusy}>
                {paymentMutation.isPending ? "Redirecting to payment..." : "Continue to payment"}
              </Button>
            )}
          </div>
        </form>

        <div className="space-y-6 lg:sticky lg:top-32 lg:h-fit">
          <div className="card-surface soft-panel p-6">
            <div className="eyebrow">Order review</div>
            <h2 className="mt-3 font-serif text-3xl font-semibold">Everything in this checkout</h2>
            <div className="mt-6 space-y-4">
              {previewItems.map((item) => (
                <div key={item.id} className="grid grid-cols-[72px,1fr,auto] gap-4 rounded-[calc(var(--radius)-0.25rem)] border bg-white/80 p-3">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                    <Image src={item.book.coverImage} alt={item.book.title} fill className="object-cover" sizes="72px" />
                  </div>
                  <div>
                    <div className="font-semibold">{item.book.title}</div>
                    <div className="text-sm text-[var(--muted-foreground)]">{item.book.author}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                      Qty {item.quantity}
                    </div>
                  </div>
                  <div className="font-semibold">{formatCurrency(item.lineTotal)}</div>
                </div>
              ))}
            </div>
            {cart.items.length > previewItems.length ? (
              <div className="mt-4 text-sm text-[var(--muted-foreground)]">
                Plus {cart.items.length - previewItems.length} more item{cart.items.length - previewItems.length === 1 ? "" : "s"} in this order.
              </div>
            ) : null}

            <div className="mt-6 space-y-4 border-t pt-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted-foreground)]">Subtotal</span>
                <span className="font-semibold">{formatCurrency(cart.summary.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted-foreground)]">Shipping</span>
                <span className="font-semibold">
                  {shippingMethod === "priority"
                    ? formatCurrency(14.5)
                    : cart.summary.shippingFee === 0
                      ? "FREE"
                      : formatCurrency(cart.summary.shippingFee)}
                </span>
              </div>
              <div className="flex items-center justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">
                  {formatCurrency(
                    cart.summary.total + (shippingMethod === "priority" ? Math.max(0, 14.5 - cart.summary.shippingFee) : 0),
                  )}
                </span>
              </div>
            </div>
          </div>

          {values.shippingAddress?.fullName ? (
            <div className="card-surface soft-panel p-6">
              <div className="eyebrow">Shipping preview</div>
              <div className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">
                {values.shippingAddress.fullName}
                <br />
                {values.shippingAddress.addressLine1}
                {values.shippingAddress.addressLine2 ? `, ${values.shippingAddress.addressLine2}` : ""}
                <br />
                {values.shippingAddress.city}, {values.shippingAddress.country} {values.shippingAddress.postalCode}
              </div>
            </div>
          ) : null}

          <div className="card-surface soft-panel p-6">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: Truck, label: "Tracked delivery" },
                { icon: CreditCard, label: "Secure payment" },
                { icon: PackageCheck, label: "Order confirmation" },
              ].map((item) => (
                <div key={item.label} className="rounded-[calc(var(--radius)-0.3rem)] border bg-white/62 p-4 text-sm">
                  <item.icon className="h-4 w-4 text-[var(--primary)]" />
                  <div className="mt-3 font-semibold">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--success)]">
              <CheckCircle2 className="h-4 w-4" />
              Validation and totals update as you complete the form.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
