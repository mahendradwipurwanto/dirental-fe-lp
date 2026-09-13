import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { api } from "./client";
import { parseSiteConfigLenient, type SiteConfig } from "@/lib/site-schema";

type SiteResponse = NonNullable<Awaited<ReturnType<typeof fetchSite>>>;
export type PublicTenant = SiteResponse["tenant"];
export type Site = Omit<SiteResponse, "config"> & { config: SiteConfig | null };
export type ListingCard = Awaited<ReturnType<typeof getListings>>["items"][number];
export type Listing = NonNullable<Awaited<ReturnType<typeof getListing>>>;
export type DirectoryItem = Awaited<ReturnType<typeof getDirectory>>[number];

async function fetchSite(slug: string) {
  const { data, response } = await api.GET("/v1/public/tenants/{slug}/site", { params: { path: { slug } } });
  if (response.status === 404) return null;
  if (!data) throw new Error(`Failed to load storefront ${slug}: ${response.status}`);
  return data;
}

/** Tenant profile + published config + bank accounts. Cached per tenant until the API revalidates it. */
export async function getSite(slug: string): Promise<Site | null> {
  "use cache";
  cacheTag(`tenant:${slug}`);
  cacheLife("max");
  const site = await fetchSite(slug);
  if (!site) return null;
  return { ...site, config: site.config ? parseSiteConfigLenient(site.config) : null };
}

export async function getListings(slug: string, query: { category?: string; featured?: boolean; q?: string; limit?: number } = {}) {
  "use cache";
  cacheTag(`tenant:${slug}`, `tenant:${slug}:listings`);
  cacheLife("days");
  const { data, response } = await api.GET("/v1/public/tenants/{slug}/listings", { params: { path: { slug }, query } });
  if (response.status === 404) return { items: [], categories: [] };
  if (!data) throw new Error(`Failed to load listings for ${slug}`);
  return data;
}

export async function getListing(slug: string, listingSlug: string) {
  "use cache";
  cacheTag(`tenant:${slug}`, `tenant:${slug}:listings`, `listing:${slug}:${listingSlug}`);
  cacheLife("days");
  const { data, response } = await api.GET("/v1/public/tenants/{slug}/listings/{listingSlug}", { params: { path: { slug, listingSlug } } });
  if (response.status === 404) return null;
  if (!data) throw new Error(`Failed to load listing ${listingSlug}`);
  return data;
}

export async function getDirectory(q?: string, limit = 24) {
  "use cache";
  cacheTag("directory");
  cacheLife("hours");
  const { data } = await api.GET("/v1/public/tenants", { params: { query: { q, limit } } });
  return data?.items ?? [];
}

export async function getLanding() {
  "use cache";
  cacheTag("directory");
  cacheLife("hours");
  const { data } = await api.GET("/v1/meta/landing");
  return data ?? { headline: "Sewa apa saja, dari siapa saja.", subheadline: "", ctaLabel: "Mulai rental", featuredTenantSlugs: [] };
}
