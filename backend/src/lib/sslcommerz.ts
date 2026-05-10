import { env } from "../config/env.js";
import { AppError } from "../utils/http.js";

const getBaseUrl = () =>
  env.SSLCOMMERZ_SANDBOX ? "https://sandbox.sslcommerz.com" : "https://securepay.sslcommerz.com";

export const isSslcommerzConfigured = () =>
  Boolean(env.SSLCOMMERZ_STORE_ID && env.SSLCOMMERZ_STORE_PASSWORD);

type SslcommerzItem = {
  title: string;
  author: string;
  quantity: number;
};

type SslcommerzAddress = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode: string;
};

type CreateSslcommerzSessionInput = {
  orderNumber: string;
  total: number;
  shippingAddress: SslcommerzAddress;
  items: SslcommerzItem[];
  notes?: string;
};

type SslcommerzSessionResponse = {
  status?: string;
  failedreason?: string;
  GatewayPageURL?: string;
};

export type SslcommerzValidationResponse = {
  status?: string;
  tran_id?: string;
  amount?: string;
  currency?: string;
  val_id?: string;
};

const assertConfigured = () => {
  if (!isSslcommerzConfigured()) {
    throw new AppError(503, "SSLCommerz is not configured yet.");
  }
};

export const createSslcommerzSession = async ({
  orderNumber,
  total,
  shippingAddress,
  items,
  notes,
}: CreateSslcommerzSessionInput) => {
  assertConfigured();

  const productName =
    items.length === 1 ? items[0].title : `${items[0]?.title ?? "BookShore order"} and ${items.length - 1} more`;
  const callbackBase = `${env.FRONTEND_URL}/api/checkout/sslcommerz`;

  const params = new URLSearchParams({
    store_id: env.SSLCOMMERZ_STORE_ID!,
    store_passwd: env.SSLCOMMERZ_STORE_PASSWORD!,
    total_amount: total.toFixed(2),
    currency: env.SSLCOMMERZ_CURRENCY,
    tran_id: orderNumber,
    success_url: `${callbackBase}/success`,
    fail_url: `${env.FRONTEND_URL}/checkout/cancel?tran_id=${encodeURIComponent(orderNumber)}`,
    cancel_url: `${env.FRONTEND_URL}/checkout/cancel?tran_id=${encodeURIComponent(orderNumber)}`,
    ipn_url: `${env.BETTER_AUTH_URL}/api/orders/checkout/ipn`,
    cus_name: shippingAddress.fullName,
    cus_email: shippingAddress.email,
    cus_add1: shippingAddress.addressLine1,
    cus_add2: shippingAddress.addressLine2 ?? "",
    cus_city: shippingAddress.city,
    cus_postcode: shippingAddress.postalCode,
    cus_country: shippingAddress.country,
    cus_phone: shippingAddress.phone,
    shipping_method: "YES",
    ship_name: shippingAddress.fullName,
    ship_add1: shippingAddress.addressLine1,
    ship_add2: shippingAddress.addressLine2 ?? "",
    ship_city: shippingAddress.city,
    ship_postcode: shippingAddress.postalCode,
    ship_country: shippingAddress.country,
    product_name: productName,
    product_category: "Books",
    product_profile: "physical-goods",
    num_of_item: String(items.reduce((sum, item) => sum + item.quantity, 0)),
    value_a: orderNumber,
    value_b: notes ?? "",
  });

  const response = await fetch(`${getBaseUrl()}/gwprocess/v4/api.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (!response.ok) {
    throw new AppError(502, "Unable to connect to SSLCommerz.");
  }

  const payload = (await response.json()) as SslcommerzSessionResponse;
  const failureReason = payload.failedreason?.trim();

  if (payload.status !== "SUCCESS" || !payload.GatewayPageURL) {
    if (failureReason?.toLowerCase().includes("credential") || failureReason?.toLowerCase().includes("de-active")) {
      throw new AppError(
        503,
        `SSLCommerz rejected the configured store credentials in ${env.SSLCOMMERZ_SANDBOX ? "sandbox" : "live"} mode. Check the store ID, store password, and account activation status.`,
        {
          gatewayMessage: failureReason,
        },
      );
    }

    throw new AppError(502, failureReason || "SSLCommerz did not return a payment URL.");
  }

  return {
    url: payload.GatewayPageURL,
  };
};

export const validateSslcommerzTransaction = async (valId: string) => {
  assertConfigured();

  const params = new URLSearchParams({
    val_id: valId,
    store_id: env.SSLCOMMERZ_STORE_ID!,
    store_passwd: env.SSLCOMMERZ_STORE_PASSWORD!,
    format: "json",
  });

  const response = await fetch(`${getBaseUrl()}/validator/api/validationserverAPI.php?${params.toString()}`);

  if (!response.ok) {
    throw new AppError(502, "Unable to validate SSLCommerz transaction.");
  }

  return (await response.json()) as SslcommerzValidationResponse;
};
