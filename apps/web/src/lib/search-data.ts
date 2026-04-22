import { cacheLife, cacheTag } from "next/cache";
import type {
  Category,
  GetProductResponse,
  ListProductsParams,
  PaginationMeta,
  Product,
  ProductCategorySlug,
} from "./integrations/swag-store-api/types";
import {
  getProduct,
  listCategories,
  listProducts,
} from "./integrations/swag-store-api";

export const SEARCH_PAGE_SIZE = 5;

/**
 * Validates `category` query value against slugs returned from `listCategories`
 * (caller passes `new Set(categories.map((c) => c.slug))`).
 */
export function parseCategoryParam(
  raw: string | string[] | undefined,
  allowedSlugs: ReadonlySet<string>,
): string | undefined {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (!v || typeof v !== "string") return undefined;
  const slug = v.trim();
  if (!slug) return undefined;
  return allowedSlugs.has(slug) ? slug : undefined;
}

export function parseQueryParam(raw: string | string[] | undefined): string {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (!v || typeof v !== "string") return "";
  return v.trim();
}

export function parsePageParam(raw: string | string[] | undefined): number {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (v === undefined || v === null || v === "") return 1;
  const n = Number.parseInt(String(v), 10);
  if (Number.isNaN(n) || n < 1) return 1;
  return n;
}

export async function getCachedProduct(
  slug: string,
): Promise<GetProductResponse> {
  "use cache";
  cacheTag(`product-${slug}`);
  cacheLife("minutes");

  return getProduct({ id: slug });
}

export async function getCachedCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("hours");

  try {
    const res = await listCategories();
    if (res.success && Array.isArray(res.data)) {
      return res.data;
    }
  } catch {
    /* empty */
  }
  return [];
}

export type SearchPageData = {
  products: Product[];
  pagination: PaginationMeta | null;
};

/**
 * Default (no `q`, no category): featured browse, same idea as the home featured strip.
 * With a search query and/or category: paginated catalog; `featured=false` is sent to the API.
 * `categorySlug` must already be validated (empty string or a slug from listCategories).
 */
export async function getSearchPageData(
  searchQuery: string,
  categorySlug: string,
  page: number,
): Promise<SearchPageData> {
  const safePage = Math.max(1, Math.floor(page) || 1);
  const params: ListProductsParams = {
    limit: SEARCH_PAGE_SIZE,
    page: safePage,
  };

  if (categorySlug) {
    params.category = categorySlug as ProductCategorySlug;
  }

  if (searchQuery.length > 0) {
    params.search = searchQuery;
  }

  if (categorySlug || searchQuery.length > 0) {
    params.featured = "false";
  } else {
    params.featured = "true";
  }

  try {
    const res = await listProducts(params);
    if (res.success && Array.isArray(res.data)) {
      const pagination = res.meta?.pagination ?? null;
      return {
        products: res.data,
        pagination,
      };
    }
  } catch {
    /* empty */
  }
  return { products: [], pagination: null };
}
