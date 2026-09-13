import "server-only";
import { notFound } from "next/navigation";
import { getSite, type Site } from "@/lib/api/storefront";
import { RESERVED_SLUGS, SLUG_REGEX } from "@/lib/site-schema";

/** Resolves an active tenant or 404s. Reserved and malformed slugs never hit the API. */
export async function loadSiteOr404(rawSlug: string): Promise<Site> {
  const slug = rawSlug.toLowerCase();
  if (!SLUG_REGEX.test(slug) || (RESERVED_SLUGS as readonly string[]).includes(slug)) notFound();
  const site = await getSite(slug);
  if (!site) notFound();
  return site;
}
