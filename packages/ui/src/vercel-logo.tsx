import Image from "next/image";

type VercelLogoProps = {
  className?: string;
  width?: number;
  height?: number;
};

/** Local SVG: `unoptimized` avoids raster optimization pipeline for vector assets. */
export function VercelLogo({
  className,
  width = 22,
  height = 22,
}: VercelLogoProps) {
  return (
    <Image
      src="/logo-vercel.svg"
      alt=""
      width={width}
      height={height}
      className={className}
      unoptimized
      priority
      aria-hidden
    />
  );
}
