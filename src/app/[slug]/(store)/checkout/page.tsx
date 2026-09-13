import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CheckoutForm } from "@/components/storefront/CheckoutForm";
import { CheckoutSteps } from "@/components/storefront/booking/CheckoutSteps";
import { api } from "@/lib/api/client";
import { getListing } from "@/lib/api/storefront";
import { quoteParamsSchema } from "@/lib/booking/schemas";
import { formatDateTime, formatIDR } from "@/lib/i18n/format";
import { loadSiteOr404 } from "@/lib/storefront/load";
import { storeUrls } from "@/lib/storefront/urls";
import { getLocale } from "next-intl/server";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function CheckoutPage({ params, searchParams }: PageProps<"/[slug]/checkout">) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const site = await loadSiteOr404(slug);
  const t = await getTranslations("booking");
  const tc = await getTranslations("common");
  const locale = await getLocale();
  const parsed = quoteParamsSchema.safeParse(sp);
  const listing = parsed.success ? await getListing(site.tenant.slug, parsed.data.item) : null;

  const quote =
    parsed.success && listing
      ? (
          await api.POST("/v1/public/tenants/{slug}/quotes", {
            params: { path: { slug: site.tenant.slug } },
            body: { items: [{ listingId: listing.id, quantity: parsed.data.qty }], startAt: parsed.data.start, endAt: parsed.data.end, fulfillment: parsed.data.fulfillment },
            cache: "no-store",
          })
        ).data
      : null;

  if (!parsed.success || !listing || !quote || !quote.ok) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <p className="text-muted-foreground">{t("expiredQuote")}</p>
        <Link href={listing ? storeUrls.item(site.tenant.slug, listing.slug) : storeUrls.catalog(site.tenant.slug)} className="mt-4 inline-block text-primary hover:underline">
          ← {tc("back")}
        </Link>
      </div>
    );
  }

  const q = parsed.data;
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <CheckoutSteps labels={[t("stepDates"), t("stepDetails"), t("stepPayment")]} current={2} />
      <h1 className="display mb-8 text-3xl md:text-4xl">{t("checkoutTitle")}</h1>
      <div className="grid gap-8 md:grid-cols-[1fr_360px]">
        <CheckoutForm slug={site.tenant.slug} listingId={listing.id} quote={{ item: q.item, start: q.start, end: q.end, qty: q.qty, fulfillment: q.fulfillment }} deliveryOffered={q.fulfillment === "delivery"} />
        <aside className="h-fit rounded-[var(--radius)] border border-border bg-card p-5 text-sm md:sticky md:top-24">
          <h2 className="mb-3 text-base font-semibold">{t("summary")}</h2>
          <p className="font-medium">{listing.name}</p>
          <p className="text-muted-foreground">
            {formatDateTime(q.start, locale)} → {formatDateTime(q.end, locale)}
          </p>
          <p className="text-muted-foreground">
            {t("quantity")}: {q.qty} · {t(q.fulfillment)}
          </p>
          <dl className="mt-4 space-y-1 border-t border-border pt-3">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t("subtotal")}</dt>
              <dd>{formatIDR(quote.subtotal)}</dd>
            </div>
            {quote.depositAmount > 0 ? (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t("deposit")}</dt>
                <dd>{formatIDR(quote.depositAmount)}</dd>
              </div>
            ) : null}
            {quote.deliveryFee > 0 ? (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t("deliveryFee")}</dt>
                <dd>{formatIDR(quote.deliveryFee)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
              <dt>{t("total")}</dt>
              <dd>{formatIDR(quote.total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
