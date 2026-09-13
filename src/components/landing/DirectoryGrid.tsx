import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SafeImage } from "@/components/storefront/SafeImage";
import type { DirectoryItem } from "@/lib/api/storefront";

export async function DirectoryGrid({ items, emptyLabel }: { items: DirectoryItem[]; emptyLabel: string }) {
  const t = await getTranslations("landing");
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/60 p-12 text-center">
        <p className="text-muted-foreground">{emptyLabel}</p>
      </div>
    );
  }
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <li key={it.slug}>
          <Link href={`/${it.slug}`} className="group block overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-[0_8px_30px_-12px_rgba(20,48,43,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            <div className="relative aspect-[16/10] bg-muted">
              {it.coverImageUrl ? (
                <SafeImage src={it.coverImageUrl} alt={it.name} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-4xl font-extrabold text-mist">{it.name.slice(0, 1)}</div>
              )}
              <span className="tag-punched absolute bottom-3 left-3 rounded-md bg-marigold py-1 pr-2.5 text-xs font-semibold text-ink">{t("listings", { count: it.listingCount })}</span>
            </div>
            <div className="flex items-start gap-3 p-4">
              {it.logoUrl ? (
                <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
                  <SafeImage src={it.logoUrl} alt="" fill sizes="40px" className="object-cover" />
                </span>
              ) : (
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-sm font-bold text-primary">{it.name.slice(0, 1)}</span>
              )}
              <div className="min-w-0">
                <h3 className="truncate text-[15px] font-bold tracking-tight">{it.name}</h3>
                {it.tagline ? <p className="line-clamp-1 text-sm text-muted-foreground">{it.tagline}</p> : null}
                {it.city ? <p className="mt-1 text-xs text-muted-foreground">{it.city}</p> : null}
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
