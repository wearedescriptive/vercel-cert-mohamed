import { cacheLife } from "next/cache";
import { ProductCard } from "../product-card";
import type { Product } from "../../lib/integrations/swag-store-api/types";
import { listProducts } from "../../lib/integrations/swag-store-api";
import { formatUsdFromCents } from "../../lib/format-price";

const PLACEHOLDER_IMAGE = "/logo-vercel.svg";

export async function FeaturedProducts() {
  "use cache";
  cacheLife("minutes");

  let products: Product[] = [];

  try {
    const res = await listProducts({ featured: "true", limit: 6 });
    if (res.success && Array.isArray(res.data)) {
      products = res.data;
    }
  } catch {
    products = [];
  }

  const showFewerNote = products.length > 0 && products.length < 6;

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
            />
          );
        })}
      </div>
      {showFewerNote ? (
        <p className="mt-3 text-sm text-muted">
          Showing {products.length} featured item
          {products.length === 1 ? "" : "s"}.
        </p>
      ) : null}
      {products.length === 0 ? (
        <p className="mt-3 text-sm text-muted">No featured products found.</p>
      ) : null}
    </>
  );
}
