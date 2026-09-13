import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CatalogGrid } from "@/components/storefront/CatalogGrid";
import { getListings } from "@/lib/api/storefront";
import { loadSiteOr404 } from "@/lib/storefront/load";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("store");
  return { title: t("catalog") };
}

export default async function CatalogPage({ params, searchParams }: PageProps<"/[slug]/items">) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const site = await loadSiteOr404(slug);
  const t = await getTranslations("store");
  const category = typeof sp.category === "string" ? sp.category : undefined;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 80) : undefined;
  const { items, categories } = await getListings(site.tenant.slug, { category, q: q || undefined, limit: 60 });
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="display mb-8 text-4xl">{t("catalog")}</h1>
      <CatalogGrid slug={site.tenant.slug} items={items} categories={categories} activeCategory={category} q={q} showSearch emptyLabel={t("emptyCatalog")} allLabel={t("allCategories")} searchPlaceholder={t("searchPlaceholder")} />
    </div>
  );
}
