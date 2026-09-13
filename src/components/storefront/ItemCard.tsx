import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { ListingCard } from "@/lib/api/storefront";
import { formatIDR } from "@/lib/i18n/format";
import { storeUrls } from "@/lib/storefront/urls";
import { SafeImage } from "./SafeImage";

/** Price sits on a punched hang-tag in the tenant's secondary colour: the one motif shared across the platform. */
export async function ItemCard({ slug, item }: { slug: string; item: ListingCard }) {
  const t = await getTranslations("store");
  const tc = await getTranslations("common");
  const cover = item.images[0];
  const price = item.pricePerDay != null ? { amount: item.pricePerDay, unit: tc("perDay") } : item.pricePerHour != null ? { amount: item.pricePerHour, unit: tc("perHour") } : null;
  const alt = item.pricePerDay != null && item.pricePerHour != null ? `${formatIDR(item.pricePerHour)}${tc("perHour")}` : null;

  return (
    <Link
      href={storeUrls.item(slug, item.slug)}
      className="group flex flex-col overflow-hidden rounded-[var(--radius)] border border-border bg-card text-card-foreground transition-shadow hover:shadow-[0_12px_32px_-16px_rgba(0,0,0,.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {cover ? <SafeImage src={cover.url} alt={cover.alt ?? item.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" /> : null}
        {price ? (
          <span className="tag-punched absolute bottom-3 left-3 rounded-md bg-secondary py-1.5 pr-3 text-sm font-bold text-secondary-foreground shadow-[0_4px_14px_-6px_rgba(0,0,0,.4)]">
            {formatIDR(price.amount)}
            <span className="text-xs font-medium opacity-80">{price.unit}</span>
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {item.category ? <span>{item.category.name}</span> : null}
          {item.isFeatured ? (
            <span className="flex items-center gap-1 font-semibold text-foreground/80">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" aria-hidden />
              {t("featured")}
            </span>
          ) : null}
        </div>
        <h3 className="line-clamp-2 text-[17px] font-bold leading-snug tracking-tight">{item.name}</h3>
        {item.summary ? <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{item.summary}</p> : null}
        {alt ? <p className="mt-auto pt-2 text-xs text-muted-foreground">{alt}</p> : null}
      </div>
    </Link>
  );
}
