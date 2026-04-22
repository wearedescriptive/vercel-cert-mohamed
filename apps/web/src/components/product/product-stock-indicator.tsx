import { getProductStock } from "../../lib/integrations/swag-store-api";
import type { StockInfo } from "../../lib/integrations/swag-store-api/types";
import { AddToCartButton } from "../cart/add-to-cart-button";

interface ProductStockIndicatorProps {
  slug: string;
  productId: string;
}

export async function ProductStockIndicator({
  slug,
  productId,
}: ProductStockIndicatorProps) {
  let stockInfo: StockInfo;
  try {
    const res = await getProductStock({ id: slug });
    stockInfo = res.data;
  } catch {
    return (
      <>
        <div className="flex items-center gap-2 text-sm">
          <span className="size-2 rounded-full bg-zinc-soft" />
          <span className="text-muted">Stock status unavailable</span>
        </div>
        <button
          type="button"
          disabled
          className="mt-2 w-full cursor-not-allowed rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-surface opacity-50"
        >
          Add to Cart unavailable
        </button>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 text-sm">
        {stockInfo.inStock ? (
          <>
            <span className="size-2 rounded-full bg-green-500" />
            <span className="text-muted">
              In stock{stockInfo.lowStock ? " — low stock" : ""}
            </span>
          </>
        ) : (
          <>
            <span className="size-2 rounded-full bg-red-500" />
            <span className="text-muted">Out of stock</span>
          </>
        )}
      </div>

      <AddToCartButton
        productId={productId}
        inStock={stockInfo.inStock}
        stock={stockInfo.stock}
      />
    </>
  );
}

export function ProductStockIndicatorSkeleton() {
  return (
    <>
      <div className="flex items-center gap-2 text-sm" aria-hidden>
        <span className="size-2 rounded-full bg-skeleton" />
        <div className="h-4 w-24 animate-pulse rounded-md bg-skeleton" />
      </div>
      <button
        type="button"
        disabled
        aria-label="Checking stock"
        className="mt-2 w-full cursor-not-allowed rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-surface opacity-50"
      >
        Checking stock...
      </button>
    </>
  );
}
