import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ProductStockIndicator,
  ProductStockIndicatorSkeleton,
} from "../../../components/product/product-stock-indicator";
import { getCachedProduct } from "../../../lib/search-data";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await getCachedProduct(slug);
    return {
      title: res.data.name,
      description: res.data.description,
      openGraph: {
        title: res.data.name,
        description: res.data.description,
        images: res.data.images.map((img) => ({ url: img })),
      },
    };
  } catch {
    return { title: "Product not found" };
  }
}

function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  let product;
  try {
    const productRes = await getCachedProduct(slug);
    product = productRes.data;
  } catch {
    notFound();
  }

  const imageUrl = product.images[0] ?? "/placeholder.png";

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="grid gap-8 sm:grid-cols-2 sm:gap-12">
        <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-zinc-soft">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 639px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <span className="mb-2 inline-block rounded-full bg-zinc-soft px-2.5 py-0.5 text-xs font-medium capitalize text-muted">
              {product.category}
            </span>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {product.name}
            </h1>
          </div>

          <p className="text-2xl font-semibold tabular-nums text-foreground">
            {formatCurrency(product.price, product.currency)}
          </p>

          <p className="leading-relaxed text-muted">{product.description}</p>

          <Suspense fallback={<ProductStockIndicatorSkeleton />}>
            <ProductStockIndicator slug={slug} productId={product.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
