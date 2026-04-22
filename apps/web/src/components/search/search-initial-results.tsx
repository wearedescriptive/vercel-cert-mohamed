import Link from "next/link";
import { redirect } from "next/navigation";
import { ProductCard } from "../product-card";
import { formatUsdFromCents } from "../../lib/format-price";
import { getSearchPageData } from "../../lib/search-data";
import { SearchPagination } from "./search-pagination";

const PLACEHOLDER_IMAGE = "/logo-vercel.svg";

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

export type SearchInitialResultsProps = {
  q: string;
  categorySlug: string;
  page: number;
};

export async function SearchInitialResults({
  q,
  categorySlug,
  page,
}: SearchInitialResultsProps) {
  const { products, pagination } = await getSearchPageData(
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

  const isSearchMode = q.length > 0 || categorySlug.length > 0;
  const showEmpty = isSearchMode && products.length === 0;

  if (showEmpty) {
    return (
      <div className="rounded-lg border border-border bg-surface px-4 py-8 text-center">
        <p className="text-sm font-medium text-foreground">
          No products match your filters.
        </p>
        <p className="mt-2 text-sm text-muted">
          Try different keywords or{" "}
          <Link
            href="/search"
            className="text-foreground underline underline-offset-2"
          >
            clear filters
          </Link>
          .
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return <p className="text-sm text-muted">No products found.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:gap-6">
        {products.map((product) => {
          const imageUrl = product.images?.[0] ?? PLACEHOLDER_IMAGE;
          const href = `/products/${encodeURIComponent(product.slug)}`;
          return (
            <ProductCard
              key={product.id}
              href={href}
              name={product.name}
              imageUrl={imageUrl}
              priceLabel={formatUsdFromCents(product.price)}
              prefetch={false}
            />
          );
        })}
      </div>
      {pagination ? (
        <SearchPagination
          pagination={pagination}
          q={q}
          categorySlug={categorySlug}
        />
      ) : null}
    </>
  );
}
