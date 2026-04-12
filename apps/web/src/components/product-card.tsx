import Image from "next/image";
import Link from "next/link";

export type ProductCardProps = {
  href: string;
  name: string;
  imageUrl: string;
  priceLabel: string;
  /** Set false on dense grids (e.g. live search) to avoid a burst of prefetch GETs when results update. */
  prefetch?: boolean;
};

export function ProductCard({
  href,
  name,
  imageUrl,
  priceLabel,
  prefetch = true,
}: ProductCardProps) {
  return (
    <Link
      href={href}
      prefetch={prefetch}
      className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-[border-color,box-shadow] duration-150 ease-out hover:border-border-hover hover:shadow-[0_4px_12px_rgb(0_0_0/0.06)]"
    >
      <div className="relative aspect-square bg-zinc-soft">
        <Image
          src={imageUrl}
          alt={name}
          fill
          quality={75}
          sizes="(max-width: 639px) calc(50vw - 0.625rem), min(33.33vw, 360px)"
          className="object-cover"
        />
      </div>
      <div className="px-4 pb-4 pt-3.5">
        <h3 className="mb-1.5 text-[0.9375rem] font-medium leading-[1.35] tracking-[-0.01em] text-foreground">
          {name}
        </h3>
        <p className="m-0 text-sm text-muted">{priceLabel}</p>
      </div>
    </Link>
  );
}
