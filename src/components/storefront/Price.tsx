import { getTranslations } from "next-intl/server";
import { formatIDR } from "@/lib/i18n/format";

/** Item-page price: the main rate on a punched tag, the alternative rate beside it. */
export async function PriceLine({ pricePerHour, pricePerDay, className = "" }: { pricePerHour: number | null; pricePerDay: number | null; className?: string }) {
  const t = await getTranslations("common");
  const main = pricePerDay != null ? { amount: pricePerDay, unit: t("perDay") } : pricePerHour != null ? { amount: pricePerHour, unit: t("perHour") } : null;
  const alt = pricePerDay != null && pricePerHour != null ? { amount: pricePerHour, unit: t("perHour") } : null;
  if (!main) return null;
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <span className="tag-punched rounded-md bg-secondary py-2 pr-3.5 text-xl font-bold text-secondary-foreground">
        {formatIDR(main.amount)}
        <span className="text-sm font-medium opacity-80">{main.unit}</span>
      </span>
      {alt ? (
        <span className="text-base text-muted-foreground">
          {formatIDR(alt.amount)}
          <span className="text-sm">{alt.unit}</span>
        </span>
      ) : null}
    </div>
  );
}
