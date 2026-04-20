import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SearchPageForm } from "../../components/search/search-page-form";
import { SearchResultsSkeleton } from "../../components/search/search-results-skeleton";
import {
  getCachedCategories,
  getCachedSearchPageData,
  parseCategoryParam,
  parsePageParam,
  parseQueryParam,
} from "../../lib/search-data";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search the Vercel Swag Store catalog by name, description, or tags. Filter by category.",
  openGraph: {
    title: "Search | Vercel Swag Store",
    description:
      "Search the Vercel Swag Store catalog by name, description, or tags. Filter by category.",
    url: "/search",
  },
};

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function SearchToolbarFallback() {
  return (
    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:gap-3">
      <div className="h-11 flex-1 animate-pulse rounded-md bg-skeleton" />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-3">
        <div className="h-11 w-full animate-pulse rounded-md bg-skeleton sm:w-24" />
        <div className="h-11 w-full animate-pulse rounded-md bg-skeleton sm:w-56" />
      </div>
    </div>
  );
}

function SearchFormFallback() {
  return (
    <div className="flex min-w-0 w-full flex-col">
      <div className="mb-8 min-w-0">
        <SearchToolbarFallback />
      </div>
      <SearchResultsSkeleton />
    </div>
  );
}

function redirectToClampedPage(
  q: string,
  categorySlug: string,
  totalPages: number,
): never {
  const params = new URLSearchParams();
  if (q.length > 0) params.set("q", q);
  if (categorySlug.length > 0) params.set("category", categorySlug);
  const last = Math.max(1, totalPages);
  if (last > 1) params.set("page", String(last));
  const qs = params.toString();
  redirect(qs ? `/search?${qs}` : "/search");
}

async function SearchContent({
  sp,
}: {
  sp: Record<string, string | string[] | undefined>;
}) {
  const q = parseQueryParam(sp.q);
  const page = parsePageParam(sp.page);

  const categories = await getCachedCategories();
  const allowedSlugs = new Set(categories.map((c) => c.slug));
  const category = parseCategoryParam(sp.category, allowedSlugs);
  const categorySlug = category ?? "";

  const { products, pagination } = await getCachedSearchPageData(
    q,
    categorySlug,
    page,
  );

  if (
    pagination &&
    pagination.totalPages >= 1 &&
    page > pagination.totalPages
  ) {
    redirectToClampedPage(q, categorySlug, pagination.totalPages);
  }

  const categoryOptions = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
  }));

  const initialSearchState = {
    q,
    categorySlug,
    page,
    products,
    pagination,
  };

  const formKey = `${q}\0${categorySlug}\0${page}`;

  return (
    <SearchPageForm
      key={formKey}
      initialSearchState={initialSearchState}
      categoryOptions={categoryOptions}
    />
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const sp = await searchParams;
  const q = parseQueryParam(sp.q);
  const rawCategory =
    (Array.isArray(sp.category) ? sp.category[0] : sp.category) ?? "";
  const isSearchMode = q.length > 0 || rawCategory.length > 0;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-10">
      <h1 className="mb-2 text-xl font-semibold tracking-[-0.02em] text-foreground">
        Search
      </h1>
      <p className="mb-8 max-w-prose text-pretty text-sm text-muted">
        {isSearchMode
          ? "Use the text field and category together or separately. Text results update as you type (after three characters) or when you press Search."
          : "Featured products (same as on the home page) appear below until you search by name, description, or tags, or pick a category."}
      </p>

      <Suspense fallback={<SearchFormFallback />}>
        <SearchContent sp={sp} />
      </Suspense>
    </div>
  );
}
