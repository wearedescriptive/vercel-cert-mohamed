import type { PaginationMeta } from "../../lib/integrations/swag-store-api/types";
import { getSearchUrl } from "../../lib/search-url";
import { PaginationBar } from "../pagination/pagination-bar";

export type SearchPaginationProps = {
  pagination: PaginationMeta;
  /** Current search query (trimmed), if any */
  q: string;
  /** Validated category slug or empty string */
  categorySlug: string;
};

export function SearchPagination({
  pagination,
  q,
  categorySlug,
}: SearchPaginationProps) {
  const { page, totalPages } = pagination;

  return (
    <div className="mt-10 flex flex-col items-center gap-3 border-t border-border pt-8">
      <PaginationBar
        page={page}
        totalPages={totalPages}
        buildHref={(p) => getSearchUrl(q, categorySlug, p)}
        aria-label="Search results pagination"
      />
    </div>
  );
}
