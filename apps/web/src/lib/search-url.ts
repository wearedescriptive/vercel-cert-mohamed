/** Query params for search facets (aligned with server and pagination links). */
export function searchFacetToParams(
  q: string,
  categorySlug: string,
  page: number,
): URLSearchParams {
  const p = new URLSearchParams();
  if (q.length > 0) p.set("q", q);
  if (categorySlug.length > 0) p.set("category", categorySlug);
  if (page > 1) p.set("page", String(page));
  return p;
}

export function getSearchUrl(
  q: string,
  categorySlug: string,
  page: number,
): string {
  const qs = searchFacetToParams(q, categorySlug, page).toString();
  return qs ? `/search?${qs}` : "/search";
}
