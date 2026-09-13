import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocaleProvider } from "@/components/LocaleProvider";
import { BlockRenderer } from "@/components/storefront/BlockRenderer";
import { PreviewBridge } from "@/components/storefront/PreviewBridge";
import { StorefrontShell } from "@/components/storefront/StorefrontShell";
import { api } from "@/lib/api/client";
import type { Site } from "@/lib/api/storefront";
import { findPage, homePage, parseSiteConfigLenient } from "@/lib/site-schema";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Renders the DRAFT config for the builder's iframe: `?token=` (preview token) and `?page=` (slug,
 * defaults to home). Never cached. PreviewBridge relays clicks to the builder and refreshes on save.
 */
export default function PreviewPage(props: PageProps<"/[slug]/preview">) {
  return (
    <LocaleProvider>
      <PreviewLoader {...props} />
    </LocaleProvider>
  );
}

async function PreviewLoader({ params, searchParams }: PageProps<"/[slug]/preview">) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const token = typeof sp.token === "string" ? sp.token : "";
  const pageSlug = typeof sp.page === "string" ? sp.page : "home";
  if (!token) notFound();
  const { data, response } = await api.GET("/v1/public/tenants/{slug}/draft-site", { params: { path: { slug }, query: { token } }, cache: "no-store" });
  if (response.status === 401 || response.status === 404 || !data) notFound();
  const site: Site = { ...data, config: data.config ? parseSiteConfigLenient(data.config) : null };
  const config = site.config!;
  const page = pageSlug === "home" ? homePage(config) : (findPage(config, pageSlug) ?? homePage(config));
  return (
    <StorefrontShell site={site} config={config} mode="preview">
      <PreviewBridge />
      <style>{`[data-block-hover]{outline:2px dashed color-mix(in oklab, var(--primary) 60%, transparent);outline-offset:-2px}[data-block-selected]{outline:2px solid var(--primary);outline-offset:-2px}`}</style>
      {page.slug !== "home" && page.title ? <h1 className="display mx-auto max-w-3xl px-4 pt-12 text-4xl sm:px-6 md:text-5xl">{page.title}</h1> : null}
      <BlockRenderer blocks={page.blocks} ctx={{ site, mode: "preview" }} />
    </StorefrontShell>
  );
}
