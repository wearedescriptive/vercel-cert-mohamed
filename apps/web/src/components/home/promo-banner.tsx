import { getActivePromotion } from "../../lib/integrations/swag-store-api";

export async function PromoBanner() {
  let title: string;
  let description: string;
  let code: string | undefined;
  let discountPercent: number | undefined;

  try {
    const res = await getActivePromotion();
    if (!res.success || !res.data) {
      return null;
    }
    title = res.data.title;
    description = res.data.description;
    code = res.data.code;
    discountPercent = res.data.discountPercent;
  } catch {
    return null;
  }

  const discountNote =
    discountPercent != null ? ` (${discountPercent}% off)` : "";

  return (
    <div
      className="bg-promo-bg px-5 py-3.5 text-center text-sm leading-[1.45] text-promo-fg"
      role="region"
      aria-label="Promotion"
    >
      <strong className="font-semibold">{title}</strong>
      {" — "}
      {description}
      {discountNote}
      {code ? ` Code: ${code}.` : ""}
    </div>
  );
}
