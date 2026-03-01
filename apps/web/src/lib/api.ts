import type {
  AdminOverview,
  AdminSession,
  CreateOrderInput,
  HomeTryOnConfig,
  LensPackage,
  Order,
  Product,
  StorefrontContent,
  TryOnRequest,
  TryOnRequestInput,
} from "@optical/shared";

interface StorefrontResponse {
  storefront: StorefrontContent;
  homeTryOn: HomeTryOnConfig;
  featuredProducts: Product[];
}

interface ProductsResponse {
  products: Product[];
}

interface ProductResponse {
  product: Product;
}

interface LensPackagesResponse {
  lensPackages: LensPackage[];
}

interface CreateTryOnResponse {
  request: TryOnRequest;
}

interface CreateOrderResponse {
  order: Order;
}

interface AdminSessionResponse {
  session: AdminSession;
}

interface AdminOverviewResponse {
  overview: AdminOverview;
}

interface AdminOrdersResponse {
  orders: Order[];
}

interface AdminTryOnRequestsResponse {
  tryOnRequests: TryOnRequest[];
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ message: "Request failed." }));
    throw new Error(payload.message ?? "Request failed.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function getStorefront() {
  return request<StorefrontResponse>("/api/storefront");
}

export function getProducts(category = "all", mode?: string) {
  const params = new URLSearchParams();

  if (category !== "all") {
    params.set("category", category);
  }

  if (mode) {
    params.set("mode", mode);
  }

  const query = params.toString();
  return request<ProductsResponse>(`/api/products${query ? `?${query}` : ""}`);
}

export function getProduct(slug: string) {
  return request<ProductResponse>(`/api/products/${slug}`);
}

export function getLensPackages() {
  return request<LensPackagesResponse>("/api/lens-packages");
}

export function createTryOn(payload: TryOnRequestInput) {
  return request<CreateTryOnResponse>("/api/home-try-on/requests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function createOrder(payload: CreateOrderInput) {
  return request<CreateOrderResponse>("/api/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginAdmin(email: string, password: string) {
  return request<AdminSessionResponse>("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function logoutAdmin() {
  return request<void>("/api/admin/logout", {
    method: "POST",
  });
}

export function getAdminSession() {
  return request<AdminSessionResponse>("/api/admin/session");
}

export function getAdminOverview() {
  return request<AdminOverviewResponse>("/api/admin/overview");
}

export function getAdminOrders() {
  return request<AdminOrdersResponse>("/api/admin/orders");
}

export function getAdminTryOnRequests() {
  return request<AdminTryOnRequestsResponse>("/api/admin/try-on-requests");
}
