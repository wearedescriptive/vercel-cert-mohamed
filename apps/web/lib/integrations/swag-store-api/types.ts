/** Types derived from OpenAPI components/schemas and paths. */

export type ProductCategorySlug =
  | "bottles"
  | "cups"
  | "mugs"
  | "desk"
  | "stationery"
  | "accessories"
  | "bags"
  | "hats"
  | "t-shirts"
  | "hoodies"
  | "socks"
  | "tech"
  | "books";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  images: string[];
  featured: boolean;
  tags: string[];
  createdAt: string;
}

export interface StockInfo {
  productId: string;
  stock: number;
  inStock: boolean;
  lowStock: boolean;
}

export interface Category {
  slug: string;
  name: string;
  productCount: number;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discountPercent: number;
  code: string;
  validFrom: string;
  validUntil: string;
  active: boolean;
}

export interface CartItemWithProduct {
  productId: string;
  quantity: number;
  addedAt: string;
  product: Product;
  lineTotal: number;
}

export interface CartWithProducts {
  token: string;
  items: CartItemWithProduct[];
  totalItems: number;
  subtotal: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductListResponse {
  success: boolean;
  data: Product[];
  meta?: {
    pagination: PaginationMeta;
  };
}

export interface ProductResponse {
  success: boolean;
  data: Product;
}

export interface StockResponse {
  success: boolean;
  data: StockInfo;
}

export interface CategoryListResponse {
  success: boolean;
  data: Category[];
}

export interface PromotionResponse {
  success: boolean;
  data: Promotion;
}

export interface CartResponse {
  success: boolean;
  data: CartWithProducts;
}

export interface AddToCartRequest {
  productId: string;
  quantity?: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface StoreFeatures {
  wishlist?: boolean;
  productComparison?: boolean;
  reviews?: boolean;
  liveChat?: boolean;
  recentlyViewed?: boolean;
}

export interface StoreSocialLinks {
  twitter?: string;
  github?: string;
  discord?: string;
}

export interface StoreSeo {
  defaultTitle?: string;
  titleTemplate?: string;
  defaultDescription?: string;
}

export interface StoreConfigData {
  storeName: string;
  currency: string;
  features?: StoreFeatures;
  socialLinks?: StoreSocialLinks;
  seo?: StoreSeo;
}

export interface GetStoreConfigResponse {
  success: boolean;
  data: StoreConfigData;
}

export interface HealthCheckData {
  status: string;
  timestamp: string;
  services: {
    redis: "connected" | "error";
  };
}

export interface HealthCheckResponse {
  success: boolean;
  data: HealthCheckData;
}

/** --- Per-operation names --- */

export interface ListProductsParams {
  page?: number;
  limit?: number;
  category?: ProductCategorySlug;
  search?: string;
  featured?: "true" | "false";
}

export type ListProductsResponse = ProductListResponse;

export interface GetProductParams {
  id: string;
}

export type GetProductResponse = ProductResponse;

export interface GetProductStockParams {
  id: string;
}

export type GetProductStockResponse = StockResponse;

export type ListCategoriesResponse = CategoryListResponse;

export type GetActivePromotionResponse = PromotionResponse;

export interface GetCartParams {
  cartToken: string;
}

export type GetCartResponse = CartResponse;

export interface AddItemToCartParams {
  cartToken: string;
}

export type AddItemToCartPayload = AddToCartRequest;

export type AddItemToCartResponse = CartResponse;

export type CreateCartResponse = CartResponse;

export interface CreateCartResult {
  body: CreateCartResponse;
  cartToken: string;
}

export interface UpdateCartItemParams {
  itemId: string;
  cartToken: string;
}

export type UpdateCartItemPayload = UpdateCartItemRequest;

export type UpdateCartItemResponse = CartResponse;

export interface RemoveCartItemParams {
  itemId: string;
  cartToken: string;
}

export type RemoveCartItemResponse = CartResponse;
