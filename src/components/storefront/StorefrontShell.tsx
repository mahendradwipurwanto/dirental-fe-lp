import type { ReactNode } from "react";
import type { Site } from "@/lib/api/storefront";
import { defaultSiteConfig, type SiteConfig } from "@/lib/site-schema";
import { storefrontFonts } from "@/lib/theme/fonts";
import { themeToStyle } from "@/lib/theme/css-vars";
import { Footer } from "./Footer";
import { Header } from "./Header";

export type ShellProps = {
  site: Site;
  /** Override the config (draft preview); defaults to published or a sane default. */
  config?: SiteConfig;
  children: ReactNode;
  mode?: "live" | "preview";
};

export function resolveConfig(site: Site, override?: SiteConfig): SiteConfig {
  return override ?? site.config ?? defaultSiteConfig({ tenantName: site.tenant.name, tagline: site.tenant.tagline ?? "" });
}

/** Applies the tenant theme as CSS variables on a wrapper so shadcn utilities re-theme inside it only. */
export function StorefrontShell({ site, config: override, children, mode = "live" }: ShellProps) {
  const config = resolveConfig(site, override);
  const font = storefrontFonts[config.theme.fontFamily] ?? storefrontFonts.inter;
  return (
    <div className={`${font.className} flex min-h-dvh flex-col bg-background text-foreground antialiased`} style={themeToStyle(config.theme, font.fontFamily)} data-storefront={site.tenant.slug} data-mode={mode}>
      <Header site={site} config={config} />
      <main className="flex-1">{children}</main>
      <Footer site={site} config={config} />
    </div>
  );
}
