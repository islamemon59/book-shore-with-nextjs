import { NextResponse } from "next/server";
import { checkoutPayloadSchema } from "@/lib/checkout";
import { authFetch } from "@/lib/server-api";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.json().catch(() => null);
  const parsed = checkoutPayloadSchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid checkout details." }, { status: 400 });
  }

  const response = await authFetch<{ item: { url: string } }>("/api/orders/checkout/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parsed.data),
  });

  return NextResponse.json({ url: response.item.url });
}
