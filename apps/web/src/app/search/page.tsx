import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchInitialResults } from "../../components/search/search-initial-results";
import { SearchPageForm } from "../../components/search/search-page-form";
import { SearchResultsSkeleton } from "../../components/search/search-results-skeleton";
import {
  getCachedCategories,
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

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const sp = await searchParams;
  const q = parseQueryParam(sp.q);
  const page = parsePageParam(sp.page);

  const categories = await getCachedCategories();
  const allowedSlugs = new Set(categories.map((c) => c.slug));
  const categorySlug = parseCategoryParam(sp.category, allowedSlugs) ?? "";
  const categoryOptions = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
  }));

  const isSearchMode = q.length > 0 || categorySlug.length > 0;
  const formKey = `${q}\0${categorySlug}\0${page}`;

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

      <SearchPageForm
        key={formKey}
        categoryOptions={categoryOptions}
        initialQ={q}
        initialCategorySlug={categorySlug}
        initialPage={page}
      >
        <Suspense fallback={<SearchResultsSkeleton />}>
          <SearchInitialResults q={q} categorySlug={categorySlug} page={page} />
        </Suspense>
      </SearchPageForm>
    </div>
  );
}
