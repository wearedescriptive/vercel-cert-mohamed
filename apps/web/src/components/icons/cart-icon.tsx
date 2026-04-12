import Image from "next/image";

type CartIconProps = {
  className?: string;
  /** Pixel width/height (square). Default 22. */
  size?: number;
};

export function CartIcon({ className, size = 22 }: CartIconProps) {
  return (
    <Image
      src="/icons/cart.svg"
      alt="Cart Icon"
      width={size}
      height={size}
      className={className}
      unoptimized
      aria-hidden
    />
  );
}
