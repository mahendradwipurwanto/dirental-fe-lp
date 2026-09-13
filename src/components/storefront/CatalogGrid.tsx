import Link from "next/link";
import { Search } from "lucide-react";
import type { ListingCard } from "@/lib/api/storefront";
import { storeUrls } from "@/lib/storefront/urls";
import { ItemCard } from "./ItemCard";

type Category = { id: string; slug: string; name: string };

export function CatalogGrid({
  slug,
  items,
  categories,
  activeCategory,
  q,
  showSearch,
  emptyLabel,
  allLabel,
  searchPlaceholder,
}: {
  slug: string;
  items: ListingCard[];
  categories: Category[];
  activeCategory?: string;
  q?: string;
  showSearch: boolean;
  emptyLabel: string;
  allLabel: string;
  searchPlaceholder: string;
}) {
  return (
    <div className="space-y-6">
      {(categories.length > 0 || showSearch) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {categories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              <Chip href={storeUrls.catalog(slug, { q })} active={!activeCategory}>
                {allLabel}
              </Chip>
              {categories.map((c) => (
                <Chip key={c.id} href={storeUrls.catalog(slug, { category: c.slug, q })} active={activeCategory === c.slug}>
                  {c.name}
                </Chip>
              ))}
            </div>
          ) : (
            <span />
          )}
          {showSearch ? (
            <form action={`/${slug}/items`} className="relative">
              {activeCategory ? <input type="hidden" name="category" value={activeCategory} /> : null}
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input name="q" defaultValue={q} placeholder={searchPlaceholder} className="h-10 w-full rounded-[var(--radius)] border border-input bg-card pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-64" />
            </form>
          ) : null}
        </div>
      )}
      {items.length === 0 ? (
        <p className="rounded-[var(--radius)] border border-dashed border-border p-12 text-center text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <ItemCard key={item.id} slug={slug} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${active ? "bg-foreground text-background" : "bg-muted text-foreground/80 hover:bg-accent"}`}>
      {children}
    </Link>
  );
}
