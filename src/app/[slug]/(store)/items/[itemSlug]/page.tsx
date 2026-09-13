import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { BookingWidget } from "@/components/storefront/BookingWidget";
import { ImageGallery } from "@/components/storefront/ImageGallery";
import { PriceLine } from "@/components/storefront/Price";
import { RichText } from "@/components/storefront/RichText";
import { getListing } from "@/lib/api/storefront";
import { richTextToPlain } from "@/lib/rich-text";
import { loadSiteOr404 } from "@/lib/storefront/load";
import { storeUrls } from "@/lib/storefront/urls";

export async function generateMetadata({ params }: PageProps<"/[slug]/items/[itemSlug]">): Promise<Metadata> {
  const { slug, itemSlug } = await params;
  const site = await loadSiteOr404(slug);
  const item = await getListing(site.tenant.slug, itemSlug);
  if (!item) return {};
  return {
    title: item.name,
    description: item.summary ?? richTextToPlain(item.description),
    openGraph: { title: item.name, description: item.summary ?? undefined, images: item.images[0] ? [item.images[0].url] : undefined },
  };
}

export default async function ItemPage({ params }: PageProps<"/[slug]/items/[itemSlug]">) {
  const { slug, itemSlug } = await params;
  const site = await loadSiteOr404(slug);
  const item = await getListing(site.tenant.slug, itemSlug);
  if (!item) notFound();
  const t = await getTranslations("store");
  const tc = await getTranslations("common");
  const attrs = Object.entries(item.attributes);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.name,
    description: item.summary ?? undefined,
    image: item.images.map((i) => i.url),
    brand: { "@type": "Organization", name: site.tenant.name },
    offers: {
      "@type": "Offer",
      priceCurrency: site.tenant.currency,
      price: item.pricePerDay ?? item.pricePerHour ?? 0,
      availability: item.stockQuantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}${storeUrls.item(site.tenant.slug, item.slug)}`,
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="mb-4 text-sm text-muted-foreground">
        <Link href={storeUrls.home(site.tenant.slug)} className="hover:text-foreground">
          {t("home")}
        </Link>
        <span className="mx-2">/</span>
        <Link href={storeUrls.catalog(site.tenant.slug, item.category ? { category: item.category.slug } : undefined)} className="hover:text-foreground">
          {item.category?.name ?? t("catalog")}
        </Link>
      </nav>
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <ImageGallery images={item.images} name={item.name} />
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {item.isFeatured ? <Badge className="bg-secondary text-secondary-foreground">{t("featured")}</Badge> : null}
              {item.category ? <Badge variant="outline">{item.category.name}</Badge> : null}
            </div>
            <h1 className="display text-4xl md:text-5xl">{item.name}</h1>
            {item.summary ? <p className="text-lg text-muted-foreground">{item.summary}</p> : null}
            <PriceLine pricePerHour={item.pricePerHour} pricePerDay={item.pricePerDay} className="pt-2" />
          </div>
          <dl className="grid gap-3 rounded-[var(--radius)] border border-border p-5 text-sm sm:grid-cols-2">
            <Row k={t("stock")} v={t("available", { count: item.stockQuantity })} />
            <Row k={t("minRental")} v={[item.pricePerDay != null ? `${item.minDays} ${tc("days")}` : null, item.pricePerHour != null ? `${item.minHours} ${tc("hours")}` : null].filter(Boolean).join(" · ")} />
            {item.depositAmount > 0 ? <Row k={tc("deposit")} v={new Intl.NumberFormat("id-ID", { style: "currency", currency: site.tenant.currency, maximumFractionDigits: 0 }).format(item.depositAmount)} /> : null}
            <Row k={t("pickup") + " / " + t("delivery")} v={[item.pickupEnabled ? t("pickup") : null, item.deliveryEnabled ? t("delivery") : null].filter(Boolean).join(" · ") || "—"} />
            {attrs.map(([k, v]) => (
              <Row key={k} k={k} v={v} />
            ))}
          </dl>
          {item.description ? (
            <div>
              <h2 className="mb-3 text-xl font-semibold">{t("details")}</h2>
              <RichText doc={item.description} className="text-muted-foreground" />
            </div>
          ) : null}
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BookingWidget
            slug={site.tenant.slug}
            listing={{
              id: item.id,
              slug: item.slug,
              name: item.name,
              pricePerHour: item.pricePerHour,
              pricePerDay: item.pricePerDay,
              minHours: item.minHours,
              minDays: item.minDays,
              maxDays: item.maxDays,
              stockQuantity: item.stockQuantity,
              depositAmount: item.depositAmount,
              deliveryEnabled: item.deliveryEnabled,
            }}
            settings={{ deliveryEnabled: site.tenant.bookingSettings.deliveryEnabled, deliveryFee: site.tenant.bookingSettings.deliveryFee, minLeadHours: site.tenant.bookingSettings.minLeadHours }}
          />
        </aside>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border/60 pb-2 last:border-0 sm:last:border-b sm:[&:nth-last-child(-n+2)]:border-0">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-right font-medium">{v}</dd>
    </div>
  );
}
