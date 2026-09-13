import type { MetadataRoute } from "next";
import { getDirectory, getListings, getSite } from "@/lib/api/storefront";
import { HOME_SLUG } from "@/lib/site-schema";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const entries: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/untuk-pemilik-rental`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/cara-kerja`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/tentang-kami`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/faq`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/browse`, changeFrequency: "daily", priority: 0.9 },
  ];
  // The API may be unreachable at build time; the sitemap then degrades to the platform pages only.
  let tenants: Awaited<ReturnType<typeof getDirectory>> = [];
  try {
    tenants = await getDirectory(undefined, 60);
  } catch {
    return entries;
  }
  for (const t of tenants) {
    entries.push({ url: `${base}/${t.slug}`, changeFrequency: "weekly", priority: 0.8 }, { url: `${base}/${t.slug}/items`, changeFrequency: "weekly", priority: 0.7 });
    const [{ items }, site] = await Promise.all([getListings(t.slug, { limit: 60 }), getSite(t.slug)]);
    for (const i of items) entries.push({ url: `${base}/${t.slug}/items/${i.slug}`, changeFrequency: "weekly", priority: 0.6 });
    for (const p of site?.config?.pages ?? []) {
      if (p.slug !== HOME_SLUG && !p.seo.noindex) entries.push({ url: `${base}/${t.slug}/p/${p.slug}`, changeFrequency: "monthly", priority: 0.4 });
    }
  }
  return entries;
}
