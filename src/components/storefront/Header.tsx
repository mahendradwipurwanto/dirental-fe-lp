import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import type { Site } from "@/lib/api/storefront";
import { waLink } from "@/lib/i18n/format";
import type { SiteConfig } from "@/lib/site-schema";
import { navHref } from "@/lib/storefront/links";
import { storeUrls } from "@/lib/storefront/urls";
import { MobileNav } from "./MobileNav";
import { SafeImage } from "./SafeImage";

export async function Header({ site, config }: { site: Site; config: SiteConfig }) {
  const t = await getTranslations("common");
  const slug = site.tenant.slug;
  const logo = config.theme.logoUrl || site.tenant.logoUrl;
  const wa = site.tenant.contact.whatsapp;
  const links = config.nav.map((item) => ({ id: item.id, label: item.label, ...navHref(slug, item, site.tenant.contact) }));

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href={storeUrls.home(slug)} className="flex min-w-0 items-center gap-3">
          {logo ? (
            <span className="relative block h-9 w-9 shrink-0 overflow-hidden rounded-full bg-muted">
              <SafeImage src={logo} alt={site.tenant.name} fill sizes="36px" className="object-cover" />
            </span>
          ) : (
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{site.tenant.name.slice(0, 1).toUpperCase()}</span>
          )}
          <span className="truncate text-base font-semibold">{site.tenant.name}</span>
        </Link>
        <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((l) => (
            <Link key={l.id} href={l.href} target={l.external ? "_blank" : undefined} rel={l.external ? "noopener noreferrer" : undefined} className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition hover:bg-accent hover:text-foreground">
              {l.label}
            </Link>
          ))}
          {wa ? (
            <Button size="sm" className="ml-2" nativeButton={false} render={<a href={waLink(wa)} target="_blank" rel="noopener noreferrer" />}>
              {t("whatsapp")}
            </Button>
          ) : null}
        </nav>
        <MobileNav links={links} whatsappHref={wa ? waLink(wa) : null} whatsappLabel={t("whatsapp")} tenantName={site.tenant.name} />
      </div>
    </header>
  );
}
