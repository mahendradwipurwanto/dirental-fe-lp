import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { LocaleProvider } from "@/components/LocaleProvider";
import { AutoRefresh } from "@/components/storefront/booking/AutoRefresh";
import { CheckoutSteps } from "@/components/storefront/booking/CheckoutSteps";
import { StatusTimeline } from "@/components/storefront/booking/StatusTimeline";
import { BankAccountList } from "@/components/storefront/booking/BankAccountList";
import { CancelBooking } from "@/components/storefront/booking/CancelBooking";
import { Countdown } from "@/components/storefront/booking/Countdown";
import { ProofUploader } from "@/components/storefront/booking/ProofUploader";
import { StorefrontShell } from "@/components/storefront/StorefrontShell";
import { api } from "@/lib/api/client";
import type { paths } from "@/lib/api/schema";
import { formatDateTime, formatIDR, waLink } from "@/lib/i18n/format";
import { loadSiteOr404 } from "@/lib/storefront/load";
import { storeUrls } from "@/lib/storefront/urls";

export const metadata: Metadata = { robots: { index: false, follow: false } };

const statusTone: Record<string, string> = {
  pending_payment: "bg-[#FEF3C7] text-[#92400E]",
  awaiting_verification: "bg-[#DBEAFE] text-[#1E40AF]",
  confirmed: "bg-accent text-primary",
  active: "bg-accent text-primary",
  completed: "bg-muted text-foreground",
  cancelled: "bg-muted text-foreground",
  expired: "bg-muted text-foreground",
  rejected: "bg-[#FEE2E2] text-[#991B1B]",
};

export default function BookingPage(props: PageProps<"/[slug]/booking/[code]">) {
  return (
    <LocaleProvider>
      <BookingLoader {...props} />
    </LocaleProvider>
  );
}

async function BookingLoader({ params, searchParams }: PageProps<"/[slug]/booking/[code]">) {
  const [{ slug, code }, sp] = await Promise.all([params, searchParams]);
  const token = typeof sp.token === "string" ? sp.token : "";
  const site = await loadSiteOr404(slug);
  if (!token) notFound();
  const { data: b, response } = await api.GET("/v1/public/tenants/{slug}/bookings/{code}", { params: { path: { slug: site.tenant.slug, code }, query: { token } }, cache: "no-store" });
  if (response.status === 404 || !b) notFound();
  return <BookingView site={site} b={b} token={token} />;
}

type BookingData = paths["/v1/public/tenants/{slug}/bookings/{code}"]["get"]["responses"]["200"]["content"]["application/json"];

async function BookingView({ site, b, token }: { site: Awaited<ReturnType<typeof loadSiteOr404>>; b: BookingData; token: string }) {
  const t = await getTranslations("booking");
  const tc = await getTranslations("common");
  const locale = await getLocale();
  const status = b.status;
  const live = status === "pending_payment" || status === "awaiting_verification" || status === "rejected";

  return (
    <StorefrontShell site={site}>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {live ? <AutoRefresh intervalMs={30_000} /> : null}
        <CheckoutSteps labels={[t("stepDates"), t("stepDetails"), t("stepPayment")]} current={3} />
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">{t("code")}</p>
            <h1 className="display text-4xl">{b.code}</h1>
          </div>
          <Badge className={`px-3 py-1 text-sm ${statusTone[status] ?? ""}`}>{t(`status.${status}`)}</Badge>
        </div>
        <section className="mb-6 rounded-[var(--radius)] border border-border bg-card p-5">
          <StatusTimeline
            status={status}
            labels={{
              pending_payment: t("status.pending_payment"),
              awaiting_verification: t("status.awaiting_verification"),
              confirmed: t("status.confirmed"),
              active: t("status.active"),
              completed: t("status.completed"),
              cancelled: t("status.cancelled"),
              expired: t("status.expired"),
              rejected: t("status.rejected"),
            }}
          />
          <p className="mt-4 text-[15px] leading-relaxed">{t(`statusHint.${status}`)}</p>
        </section>

        {status === "pending_payment" && b.expiresAt ? (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius)] border border-amber-300 bg-amber-50 p-4 text-amber-900">
            <span className="text-sm">
              {t("payBefore")} <strong>{formatDateTime(b.expiresAt, locale)}</strong>
            </span>
            <Countdown expiresAt={b.expiresAt} serverTime={b.serverTime} label={t("timeLeft")} expiredLabel={t("expiredNow")} />
          </div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2">
          <section className="space-y-3 rounded-[var(--radius)] border border-border p-5">
            <h2 className="font-semibold">{t("items")}</h2>
            <ul className="space-y-2 text-sm">
              {b.items.map((i) => (
                <li key={i.id} className="flex justify-between gap-3">
                  <span>
                    <Link href={storeUrls.item(site.tenant.slug, i.listing.slug)} className="font-medium hover:underline">
                      {i.listing.name}
                    </Link>
                    <span className="block text-muted-foreground">
                      {i.quantity} × {i.units} {i.pricingMode === "hour" ? tc("hours") : tc("days")}
                    </span>
                  </span>
                  <span>{formatIDR(i.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <dl className="space-y-1 border-t border-border pt-3 text-sm">
              {b.depositAmount > 0 ? (
                <div className="flex justify-between text-muted-foreground">
                  <dt>{t("deposit")}</dt>
                  <dd>{formatIDR(b.depositAmount)}</dd>
                </div>
              ) : null}
              {b.deliveryFee > 0 ? (
                <div className="flex justify-between text-muted-foreground">
                  <dt>{t("deliveryFee")}</dt>
                  <dd>{formatIDR(b.deliveryFee)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between text-base font-semibold">
                <dt>{t("total")}</dt>
                <dd>{formatIDR(b.total)}</dd>
              </div>
            </dl>
          </section>
          <section className="space-y-3 rounded-[var(--radius)] border border-border p-5 text-sm">
            <h2 className="font-semibold">{t("schedule")}</h2>
            <p>
              {formatDateTime(b.startAt, locale)}
              <br />→ {formatDateTime(b.endAt, locale)}
            </p>
            <p className="text-muted-foreground">
              {t(b.fulfillment)}
              {b.deliveryAddress ? ` · ${b.deliveryAddress}` : ""}
            </p>
            <h2 className="pt-2 font-semibold">{t("customer")}</h2>
            <p>
              {b.customerName}
              <br />
              <span className="text-muted-foreground">
                {b.customerPhone} · {b.customerEmail}
              </span>
            </p>
            {b.rejectedReason && status === "rejected" ? (
              <p className="rounded-md bg-red-50 p-2 text-red-900">
                {t("reason")}: {b.rejectedReason}
              </p>
            ) : null}
          </section>
        </div>

        {live ? (
          <section className="mt-6 space-y-4 rounded-[var(--radius)] border border-border p-5">
            <h2 className="font-semibold">{t("bankAccounts")}</h2>
            <BankAccountList accounts={b.bankAccounts} total={b.total} copyLabel={tc("copy")} copiedLabel={tc("copied")} />
            {b.instructions ? (
              <div>
                <h3 className="mb-1 text-sm font-semibold">{t("instructions")}</h3>
                <p className="whitespace-pre-line text-sm text-muted-foreground">{b.instructions}</p>
              </div>
            ) : null}
          </section>
        ) : null}

        {b.canUploadProof ? (
          <section className="mt-6 rounded-[var(--radius)] border border-border p-5">
            <h2 className="mb-3 font-semibold">{t("uploadProof")}</h2>
            <ProofUploader slug={site.tenant.slug} code={b.code} token={token} bankAccounts={b.bankAccounts} />
          </section>
        ) : null}

        {b.proofs.length > 0 ? (
          <section className="mt-6 rounded-[var(--radius)] border border-border p-5 text-sm">
            <h2 className="mb-2 font-semibold">{t("proofHistory")}</h2>
            <ul className="space-y-1">
              {b.proofs.map((p) => (
                <li key={p.id} className="flex justify-between gap-3">
                  <span className="text-muted-foreground">{formatDateTime(p.createdAt, locale)}</span>
                  <span>
                    {t(`proofStatus.${p.status}`)}
                    {p.note ? <span className="text-muted-foreground"> · {p.note}</span> : null}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-sm">
          <p className="text-muted-foreground">{t("saveLink")}</p>
          <div className="flex gap-3">
            {b.tenant.whatsapp ? (
              <a href={waLink(b.tenant.whatsapp, `Halo, saya mau tanya booking ${b.code}`)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {t("needHelp")}
              </a>
            ) : null}
            {b.canCancel ? <CancelBooking slug={site.tenant.slug} code={b.code} token={token} /> : null}
          </div>
        </div>
      </div>
    </StorefrontShell>
  );
}
