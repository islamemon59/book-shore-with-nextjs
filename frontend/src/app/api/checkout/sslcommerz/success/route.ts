import { NextResponse } from "next/server";

export const runtime = "nodejs";

const readPaymentParams = async (request: Request) => {
  const url = new URL(request.url);
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    return {
      tranId: String(formData.get("tran_id") ?? url.searchParams.get("tran_id") ?? ""),
      valId: String(formData.get("val_id") ?? url.searchParams.get("val_id") ?? ""),
    };
  }

  return {
    tranId: url.searchParams.get("tran_id") ?? "",
    valId: url.searchParams.get("val_id") ?? "",
  };
};

const redirectToSuccess = (request: Request, tranId: string, valId: string) => {
  const url = new URL("/checkout/success", request.url);
  url.searchParams.set("tran_id", tranId);
  url.searchParams.set("val_id", valId);
  return NextResponse.redirect(url);
};

export async function GET(request: Request) {
  const { tranId, valId } = await readPaymentParams(request);
  return redirectToSuccess(request, tranId, valId);
}

export async function POST(request: Request) {
  const { tranId, valId } = await readPaymentParams(request);
  return redirectToSuccess(request, tranId, valId);
}
