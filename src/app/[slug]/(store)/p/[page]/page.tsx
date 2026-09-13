import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/storefront/BlockRenderer";
import { resolveConfig } from "@/components/storefront/StorefrontShell";
import { findPage, HOME_SLUG } from "@/lib/site-schema";
import { loadSiteOr404 } from "@/lib/storefront/load";

export async function generateMetadata({ params }: PageProps<"/[slug]/p/[page]">): Promise<Metadata> {
  const { slug, page } = await params;
  const site = await loadSiteOr404(slug);
  const p = findPage(resolveConfig(site), page);
  if (!p || p.slug === HOME_SLUG) return {};
  return { title: p.seo.title || p.title, description: p.seo.description || undefined, robots: p.seo.noindex ? { index: false } : undefined };
}

/** Custom pages live inside the published site config, so they share the cache entry of the storefront. */
export default async function CustomPage({ params }: PageProps<"/[slug]/p/[page]">) {
  const { slug, page } = await params;
  const site = await loadSiteOr404(slug);
  const p = findPage(resolveConfig(site), page);
  if (!p || p.slug === HOME_SLUG) notFound();
  return (
    <>
      {p.title ? <h1 className="display mx-auto max-w-3xl px-4 pt-12 text-4xl sm:px-6 md:text-5xl">{p.title}</h1> : null}
      <BlockRenderer blocks={p.blocks} ctx={{ site, mode: "live" }} />
    </>
  );
}
