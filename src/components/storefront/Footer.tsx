import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Site } from "@/lib/api/storefront";
import { PLATFORM_NAME } from "@/lib/platform";
import { HOME_SLUG, type SiteConfig } from "@/lib/site-schema";
import { storeUrls } from "@/lib/storefront/urls";
import { LocaleSwitcher } from "./LocaleSwitcher";

export async function Footer({ site, config }: { site: Site; config: SiteConfig }) {
  const t = await getTranslations("common");
  const pages = config.footer.showPages ? config.pages.filter((p) => p.slug !== HOME_SLUG && !p.seo.noindex) : [];
  const c = site.tenant.contact;
  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="space-y-2">
          <p className="text-lg font-bold tracking-tight">{site.tenant.name}</p>
          {site.tenant.tagline ? <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{site.tenant.tagline}</p> : null}
          {config.footer.text ? <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{config.footer.text}</p> : null}
        </div>
        {config.footer.showContact ? (
          <address className="space-y-1 text-sm not-italic leading-relaxed text-muted-foreground">
            {c.address ? <p>{c.address}</p> : null}
            {c.city ? <p>{c.city}</p> : null}
            {c.whatsapp ? <p>WhatsApp {c.whatsapp}</p> : null}
            {c.email ? <p>{c.email}</p> : null}
          </address>
        ) : (
          <span />
        )}
        <div className="flex flex-col gap-2 text-sm md:items-end">
          {pages.map((p) => (
            <Link key={p.slug} href={storeUrls.page(site.tenant.slug, p.slug)} className="text-muted-foreground hover:text-foreground">
              {p.title || p.slug}
            </Link>
          ))}
          <LocaleSwitcher className="mt-2" />
        </div>
      </div>
      {config.footer.showPoweredBy ? (
        <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
          {t("poweredBy")}{" "}
          <Link href="/" className="font-semibold hover:text-foreground">
            {PLATFORM_NAME}
          </Link>
        </div>
      ) : null}
    </footer>
  );
}
