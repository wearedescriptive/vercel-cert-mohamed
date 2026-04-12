"use server";

import type {
  PaginationMeta,
  Product,
} from "../../lib/integrations/swag-store-api/types";
import {
  getCachedCategories,
  getCachedSearchPageData,
  parseCategoryParam,
  parsePageParam,
  parseQueryParam,
} from "../../lib/search-data";

export type SearchActionState = {
  q: string;
  categorySlug: string;
  page: number;
  products: Product[];
  pagination: PaginationMeta | null;
};

export async function runSearch(
  prev: SearchActionState,
  formData: FormData,
): Promise<SearchActionState> {
  const q = parseQueryParam(String(formData.get("q") ?? ""));
  const categoryRaw = formData.get("category");
  const pageRaw = formData.get("page");

  const categories = await getCachedCategories();
  const allowedSlugs = new Set(categories.map((c) => c.slug));
  const categoryParsed = parseCategoryParam(
    typeof categoryRaw === "string" ? categoryRaw : undefined,
    allowedSlugs,
  );
  const categorySlug = categoryParsed ?? "";

  let page = parsePageParam(typeof pageRaw === "string" ? pageRaw : undefined);

  const qChanged = q !== prev.q;
  const categoryChanged = categorySlug !== prev.categorySlug;
  if (qChanged || categoryChanged) {
    page = 1;
  }

  let { products, pagination } = await getCachedSearchPageData(
    q,
    categorySlug,
    page,
  );

  if (
    pagination &&
    pagination.totalPages >= 1 &&
    page > pagination.totalPages
  ) {
    const last = Math.max(1, pagination.totalPages);
    ({ products, pagination } = await getCachedSearchPageData(
      q,
      categorySlug,
      last,
    ));
    page = last;
  }

  return {
    q,
    categorySlug,
    page,
    products,
    pagination,
  };
}
