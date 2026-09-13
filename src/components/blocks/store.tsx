import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CatalogGrid } from "@/components/storefront/CatalogGrid";
import { ItemCard } from "@/components/storefront/ItemCard";
import { PriceLine } from "@/components/storefront/Price";
import { SafeImage } from "@/components/storefront/SafeImage";
import { getListing, getListings } from "@/lib/api/storefront";
import { storeUrls } from "@/lib/storefront/urls";
import type { BlockProps } from "./registry";

const colsClass = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" } as const;

export async function ListingGridBlock({ block, ctx }: BlockProps<"listing_grid">) {
  const t = await getTranslations("store");
  const slug = ctx.site.tenant.slug;
  const query = block.source === "featured" ? { featured: true } : block.source === "category" && block.category ? { category: block.category } : {};
  const result = await getListings(slug, { ...query, limit: block.limit });
  const categories = result.categories;
  const items = result.items.length === 0 && block.source === "featured" ? (await getListings(slug, { limit: block.limit })).items : result.items;
  const interactive = block.showSearch || block.showCategories;
  return (
    <div>
      {block.title || block.showViewAll ? (
        <div className="mb-6 flex items-baseline justify-between gap-4">
          {block.title ? <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{block.title}</h2> : <span />}
          {block.showViewAll ? (
            <Link href={storeUrls.catalog(slug)} className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
              {t("viewAll")}
            </Link>
          ) : null}
        </div>
      ) : null}
      {interactive ? (
        <CatalogGrid slug={slug} items={items} categories={block.showCategories ? categories : []} showSearch={block.showSearch} emptyLabel={t("emptyCatalog")} allLabel={t("allCategories")} searchPlaceholder={t("searchPlaceholder")} />
      ) : items.length === 0 ? (
        <p className="rounded-[var(--radius)] border border-dashed border-border p-10 text-center text-sm text-muted-foreground">{t("emptyCatalog")}</p>
      ) : (
        <div className={`grid gap-5 ${colsClass[block.columns]}`}>
          {items.map((item) => (
            <ItemCard key={item.id} slug={slug} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export async function ListingSpotlightBlock({ block, ctx }: BlockProps<"listing_spotlight">) {
  const t = await getTranslations("store");
  const slug = ctx.site.tenant.slug;
  const item = block.listingSlug ? await getListing(slug, block.listingSlug) : null;
  if (!item) {
    return ctx.mode === "preview" ? <p className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Pilih item untuk disorot.</p> : null;
  }
  const cover = item.images[0];
  return (
    <div className={`grid items-center gap-8 md:grid-cols-2 ${block.imagePosition === "right" ? "md:[&>*:first-child]:order-2" : ""}`}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius)] bg-muted">{cover ? <SafeImage src={cover.url} alt={cover.alt ?? item.name} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" /> : null}</div>
      <div className="space-y-4">
        {block.eyebrow ? <p className="text-sm font-semibold text-primary">{block.eyebrow}</p> : null}
        <h2 className="display text-3xl md:text-4xl">{item.name}</h2>
        {item.summary ? <p className="text-lg leading-relaxed text-muted-foreground">{item.summary}</p> : null}
        <PriceLine pricePerHour={item.pricePerHour} pricePerDay={item.pricePerDay} />
        {block.note ? <p className="text-sm text-muted-foreground">{block.note}</p> : null}
        <Link href={storeUrls.item(slug, item.slug)} className="inline-flex h-12 items-center rounded-[var(--radius)] bg-primary px-6 text-[15px] font-semibold text-primary-foreground hover:opacity-90">
          {t("book")}
        </Link>
      </div>
    </div>
  );
}
