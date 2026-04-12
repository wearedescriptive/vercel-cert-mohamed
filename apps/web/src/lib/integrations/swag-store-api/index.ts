/**
 * Swag Store API client.
 *
 * Required env (server-side):
 * - STORE_API_URL — base URL including `/api` (e.g. https://vercel-swag-store-api.vercel.app/api)
 * - STORE_API_SECRET — Vercel Deployment Protection bypass token for `x-vercel-protection-bypass`
 */

import type {
  AddItemToCartParams,
  AddItemToCartPayload,
  AddItemToCartResponse,
  CreateCartResult,
  ErrorResponse,
  GetActivePromotionResponse,
  GetCartParams,
  GetCartResponse,
  GetProductParams,
  GetProductResponse,
  GetProductStockParams,
  GetProductStockResponse,
  GetStoreConfigResponse,
  HealthCheckResponse,
  ListCategoriesResponse,
  ListProductsParams,
  ListProductsResponse,
  RemoveCartItemParams,
  RemoveCartItemResponse,
  UpdateCartItemParams,
  UpdateCartItemPayload,
  UpdateCartItemResponse,
} from "./types";

export * from "./types";

export class StoreApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly body?: unknown;

  constructor(
    message: string,
    options: { status: number; code?: string; body?: unknown },
  ) {
    super(message);
    this.name = "StoreApiError";
    this.status = options.status;
    this.code = options.code;
    this.body = options.body;
  }
}

function getBaseUrl(): string {
  const raw = process.env.STORE_API_URL;
  if (!raw?.trim()) {
    throw new Error(
      "STORE_API_URL is not set. It must include the /api path (e.g. https://host.vercel.app/api).",
    );
  }
  return raw.replace(/\/+$/, "");
}

// function getBypassToken(): string {
//   const token = process.env.STORE_API_SECRET?.trim();
//   if (!token) {
//     throw new Error(
//       "STORE_API_SECRET is not set. It is required on every request.",
//     );
//   }
//   return token;
// }

function defaultHeaders(cartToken?: string): HeadersInit {
  const headers: Record<string, string> = {
    //"x-vercel-protection-bypass": getBypassToken(),
    "x-vercel-protection-bypass": "", //apis currently not working with bypass token
  };
  if (cartToken) {
    headers["x-cart-token"] = cartToken;
  }
  return headers;
}

async function parseErrorBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function isErrorResponse(body: unknown): body is ErrorResponse {
  return (
    typeof body === "object" &&
    body !== null &&
    "success" in body &&
    (body as ErrorResponse).success === false &&
    "error" in body &&
    typeof (body as ErrorResponse).error === "object" &&
    (body as ErrorResponse).error !== null
  );
}

const INTEGRATION_LOG_PREFIX = "[integrations:swag-store-api]";

function sanitizeHeadersForLog(headers: HeadersInit | undefined): unknown {
  if (!headers) return undefined;
  const h = new Headers(headers);
  const out: Record<string, string> = {};
  h.forEach((value, key) => {
    const lk = key.toLowerCase();
    if (lk === "x-vercel-protection-bypass" || lk === "x-cart-token") {
      out[key] = value ? "[redacted]" : "";
    } else {
      out[key] = value;
    }
  });
  return out;
}

function logIntegrationRequest(url: string, init?: RequestInit): void {
  console.log(INTEGRATION_LOG_PREFIX, "request", {
    method: init?.method ?? "GET",
    url,
    headers: sanitizeHeadersForLog(init?.headers),
    body: init?.body ?? undefined,
  });
}

function logIntegrationResponse(
  url: string,
  status: number,
  data: unknown,
): void {
  console.log(INTEGRATION_LOG_PREFIX, "response", { url, status, data });
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  logIntegrationRequest(url, init);
  const res = await fetch(url, init);
  const body = await parseErrorBody(res);
  logIntegrationResponse(url, res.status, body);

  if (!res.ok) {
    let message = res.statusText || `HTTP ${res.status}`;
    let code: string | undefined;
    if (isErrorResponse(body)) {
      message = body.error.message;
      code = body.error.code;
    }
    throw new StoreApiError(message, { status: res.status, code, body });
  }

  return body as T;
}

function buildProductsQuery(params?: ListProductsParams): string {
  if (!params) return "";
  const search = new URLSearchParams();
  if (params.page !== undefined) search.set("page", String(params.page));
  if (params.limit !== undefined) search.set("limit", String(params.limit));
  if (params.category !== undefined) search.set("category", params.category);
  if (params.search !== undefined) search.set("search", params.search);
  if (params.featured !== undefined) search.set("featured", params.featured);
  const q = search.toString();
  return q ? `?${q}` : "";
}

export async function listProducts(
  params?: ListProductsParams,
): Promise<ListProductsResponse> {
  const query = buildProductsQuery(params);
  return requestJson<ListProductsResponse>(`/products${query}`, {
    method: "GET",
    headers: defaultHeaders(),
  });
}

export async function getProduct(
  params: GetProductParams,
): Promise<GetProductResponse> {
  const id = encodeURIComponent(params.id);
  return requestJson<GetProductResponse>(`/products/${id}`, {
    method: "GET",
    headers: defaultHeaders(),
  });
}

export async function getProductStock(
  params: GetProductStockParams,
): Promise<GetProductStockResponse> {
  const id = encodeURIComponent(params.id);
  return requestJson<GetProductStockResponse>(`/products/${id}/stock`, {
    method: "GET",
    headers: defaultHeaders(),
  });
}

export async function listCategories(): Promise<ListCategoriesResponse> {
  return requestJson<ListCategoriesResponse>("/categories", {
    method: "GET",
    headers: defaultHeaders(),
  });
}

export async function getActivePromotion(): Promise<GetActivePromotionResponse> {
  return requestJson<GetActivePromotionResponse>("/promotions", {
    method: "GET",
    headers: defaultHeaders(),
  });
}

export async function getCart(params: GetCartParams): Promise<GetCartResponse> {
  return requestJson<GetCartResponse>("/cart", {
    method: "GET",
    headers: defaultHeaders(params.cartToken),
  });
}

export async function addItemToCart(
  params: AddItemToCartParams,
  payload: AddItemToCartPayload,
): Promise<AddItemToCartResponse> {
  return requestJson<AddItemToCartResponse>("/cart", {
    method: "POST",
    headers: {
      ...defaultHeaders(params.cartToken),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function createCart(): Promise<CreateCartResult> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/cart/create`;
  const init: RequestInit = {
    method: "POST",
    headers: {
      ...defaultHeaders(),
      "Content-Type": "application/json",
    },
  };
  logIntegrationRequest(url, init);
  const res = await fetch(url, init);
  const body = await parseErrorBody(res);
  logIntegrationResponse(url, res.status, body);

  if (!res.ok) {
    let message = res.statusText || `HTTP ${res.status}`;
    let code: string | undefined;
    if (isErrorResponse(body)) {
      message = body.error.message;
      code = body.error.code;
    }
    throw new StoreApiError(message, { status: res.status, code, body });
  }

  const cartToken = res.headers.get("x-cart-token")?.trim();
  if (!cartToken) {
    throw new StoreApiError(
      "Missing x-cart-token response header from createCart",
      {
        status: res.status,
        body,
      },
    );
  }

  return {
    body: body as CreateCartResult["body"],
    cartToken,
  };
}

export async function updateCartItem(
  params: UpdateCartItemParams,
  payload: UpdateCartItemPayload,
): Promise<UpdateCartItemResponse> {
  const itemId = encodeURIComponent(params.itemId);
  return requestJson<UpdateCartItemResponse>(`/cart/${itemId}`, {
    method: "PATCH",
    headers: {
      ...defaultHeaders(params.cartToken),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function removeCartItem(
  params: RemoveCartItemParams,
): Promise<RemoveCartItemResponse> {
  const itemId = encodeURIComponent(params.itemId);
  return requestJson<RemoveCartItemResponse>(`/cart/${itemId}`, {
    method: "DELETE",
    headers: defaultHeaders(params.cartToken),
  });
}

export async function getStoreConfig(): Promise<GetStoreConfigResponse> {
  return requestJson<GetStoreConfigResponse>("/store/config", {
    method: "GET",
    headers: defaultHeaders(),
  });
}

export async function healthCheck(): Promise<HealthCheckResponse> {
  return requestJson<HealthCheckResponse>("/health", {
    method: "GET",
    headers: defaultHeaders(),
  });
}
