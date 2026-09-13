import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LocaleProvider } from "@/components/LocaleProvider";
import { StorefrontShell } from "@/components/storefront/StorefrontShell";
import { loadSiteOr404 } from "@/lib/storefront/load";
import StoreLoading from "./loading";

export async function generateMetadata({ params }: LayoutProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const site = await loadSiteOr404(slug);
  const seo = site.config?.seo;
  const title = seo?.title || site.tenant.name;
  const description = seo?.description || site.tenant.tagline || undefined;
  const logo = site.config?.theme.logoUrl || site.tenant.logoUrl || undefined;
  return {
    title: { default: title, template: `%s · ${site.tenant.name}` },
    description,
    icons: logo ? { icon: logo } : undefined,
    openGraph: { title, description, siteName: site.tenant.name, type: "website", images: seo?.ogImageUrl ? [seo.ogImageUrl] : undefined },
    alternates: { canonical: `/${site.tenant.slug}` },
    robots: site.config ? undefined : { index: false, follow: false },
  };
}

async function ComingSoon({ name }: { name: string }) {
  const t = await getTranslations("store");
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="text-2xl font-bold">{name}</h1>
      <p className="text-muted-foreground">{t("comingSoon")}</p>
    </div>
  );
}

/**
 * Params and the tenant lookup happen inside the Suspense boundary (Cache Components requirement).
 * Unknown tenants therefore stream a not-found page (Next marks it noindex); reserved slugs are
 * hard-404ed earlier in proxy.ts.
 */
async function StoreFrame({ params, children }: LayoutProps<"/[slug]">) {
  const { slug } = await params;
  const site = await loadSiteOr404(slug);
  return <StorefrontShell site={site}>{site.config ? children : <ComingSoon name={site.tenant.name} />}</StorefrontShell>;
}

export default function StoreLayout(props: LayoutProps<"/[slug]">) {
  return (
    <LocaleProvider fallback={<StoreLoading />}>
      <StoreFrame {...props} />
    </LocaleProvider>
  );
}
