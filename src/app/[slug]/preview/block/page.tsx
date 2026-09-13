import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocaleProvider } from "@/components/LocaleProvider";
import { BlockRenderer } from "@/components/storefront/BlockRenderer";
import { resolveConfig } from "@/components/storefront/StorefrontShell";
import { api } from "@/lib/api/client";
import type { Site } from "@/lib/api/storefront";
import { BLOCK_TYPES, defaultBlock, parseSiteConfigLenient, type Block, type BlockType } from "@/lib/site-schema";
import { storefrontFonts } from "@/lib/theme/fonts";
import { themeToStyle } from "@/lib/theme/css-vars";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/** Sample content so the preview in the builder's palette looks like a real page, not an empty shell. */
function sampleFor(type: BlockType, site: Site): Block {
  const name = site.tenant.name;
  const tagline = site.tenant.tagline ?? "Sewa mudah, ambil di tempat, bayar transfer.";
  const b = defaultBlock(type);
  switch (b.type) {
    case "hero":
      return { ...b, title: name, subtitle: tagline };
    case "heading":
      return { ...b, text: `Tentang ${name}`, subtext: tagline };
    case "cta":
      return { ...b, title: "Siap menyewa?", body: tagline };
    case "listing_spotlight":
      return b;
    case "group":
      return { ...b, children: b.children.map((c) => (c.type === "heading" ? { ...c, text: `Bagian bebas di ${name}` } : c)) };
    default:
      return b;
  }
}

/**
 * Renders ONE block with the tenant's theme, for the builder's "add component" preview.
 * `?type=` selects the block type; listing blocks use the tenant's real items.
 */
export default function BlockPreviewPage(props: PageProps<"/[slug]/preview/block">) {
  return (
    <LocaleProvider>
      <BlockPreview {...props} />
    </LocaleProvider>
  );
}

async function BlockPreview({ params, searchParams }: PageProps<"/[slug]/preview/block">) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const token = typeof sp.token === "string" ? sp.token : "";
  const type = typeof sp.type === "string" && (BLOCK_TYPES as readonly string[]).includes(sp.type) ? (sp.type as BlockType) : null;
  if (!token || !type) notFound();
  const { data, response } = await api.GET("/v1/public/tenants/{slug}/draft-site", { params: { path: { slug }, query: { token } }, cache: "no-store" });
  if (response.status === 401 || response.status === 404 || !data) notFound();
  const site: Site = { ...data, config: data.config ? parseSiteConfigLenient(data.config) : null };
  const config = resolveConfig(site);
  const font = storefrontFonts[config.theme.fontFamily] ?? storefrontFonts.inter;
  let block = sampleFor(type, site);
  if (block.type === "listing_spotlight") {
    const { data: listings } = await api.GET("/v1/public/tenants/{slug}/listings", { params: { path: { slug }, query: { limit: 1 } }, cache: "no-store" });
    block = { ...block, listingSlug: listings?.items[0]?.slug ?? "" };
  }
  return (
    <div className={`${font.className} min-h-dvh bg-background text-foreground antialiased`} style={themeToStyle(config.theme, font.fontFamily)} data-block-preview={type}>
      <BlockRenderer blocks={[block]} ctx={{ site, mode: "preview" }} />
    </div>
  );
}
