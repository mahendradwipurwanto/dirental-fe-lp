import { BlockRenderer } from "@/components/storefront/BlockRenderer";
import { resolveConfig } from "@/components/storefront/StorefrontShell";
import { homePage } from "@/lib/site-schema";
import { loadSiteOr404 } from "@/lib/storefront/load";

export default async function StoreHomePage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const site = await loadSiteOr404(slug);
  const config = resolveConfig(site);
  return <BlockRenderer blocks={homePage(config).blocks} ctx={{ site, mode: "live" }} />;
}
