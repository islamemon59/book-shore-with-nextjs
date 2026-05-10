import { NextResponse } from "next/server";
import { authFetch } from "@/lib/server-api";
import type { CheckoutOrder } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const tranId = typeof body?.tranId === "string" ? body.tranId : "";
  const valId = typeof body?.valId === "string" ? body.valId : "";

  if (!tranId || !valId) {
    return NextResponse.json({ message: "Missing SSLCommerz payment details." }, { status: 400 });
  }

  const orderResponse = await authFetch<{ item: CheckoutOrder }>("/api/orders/checkout/complete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tranId,
      valId,
    }),
  });

  return NextResponse.json({
    success: true,
    item: orderResponse.item,
  });
}
