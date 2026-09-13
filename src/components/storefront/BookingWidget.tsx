"use client";
import { id as idLocale, enGB } from "date-fns/locale";
import { Minus, Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { browserApi } from "@/lib/api/browser";
import type { paths } from "@/lib/api/schema";
import { formatIDR, jakartaToIso } from "@/lib/i18n/format";

type QuoteData = paths["/v1/public/tenants/{slug}/quotes"]["post"]["responses"]["200"]["content"]["application/json"] | undefined;

export type WidgetListing = {
  id: string;
  slug: string;
  name: string;
  pricePerHour: number | null;
  pricePerDay: number | null;
  minHours: number;
  minDays: number;
  maxDays: number | null;
  stockQuantity: number;
  depositAmount: number;
  deliveryEnabled: boolean;
};

export type WidgetSettings = { deliveryEnabled: boolean; deliveryFee: number; minLeadHours: number };

const HOURS = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, "0")}:00`);

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export function BookingWidget({ slug, listing, settings }: { slug: string; listing: WidgetListing; settings: WidgetSettings }) {
  const t = useTranslations("booking");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const canHour = listing.pricePerHour != null;
  const canDay = listing.pricePerDay != null;
  const [mode, setMode] = useState<"day" | "hour">(canDay ? "day" : "hour");
  const tomorrow = useMemo(() => addDays(new Date(), 1), []);
  const [range, setRange] = useState<DateRange | undefined>({ from: tomorrow, to: addDays(tomorrow, Math.max(1, listing.minDays)) });
  const [day, setDay] = useState<Date | undefined>(tomorrow);
  const [pickupTime, setPickupTime] = useState("09:00");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState(`${String(Math.min(23, 9 + Math.max(1, listing.minHours))).padStart(2, "0")}:00`);
  const [qty, setQty] = useState(1);
  const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">("pickup");
  const [quote, setQuote] = useState<QuoteData>(undefined);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState<Date>(tomorrow);
  const [unavailableDays, setUnavailableDays] = useState<Set<string>>(new Set());

  const deliveryOffered = settings.deliveryEnabled && listing.deliveryEnabled;

  const { startAt, endAt } = useMemo(() => {
    if (mode === "day") {
      if (!range?.from) return { startAt: null, endAt: null };
      const to = range.to && range.to > range.from ? range.to : addDays(range.from, 1);
      return { startAt: jakartaToIso(ymd(range.from), pickupTime), endAt: jakartaToIso(ymd(to), pickupTime) };
    }
    if (!day) return { startAt: null, endAt: null };
    return { startAt: jakartaToIso(ymd(day), startTime), endAt: jakartaToIso(ymd(day), endTime) };
  }, [mode, range, day, pickupTime, startTime, endTime]);

  // Per-day availability for the visible month, to grey out fully booked days.
  useEffect(() => {
    let cancelled = false;
    const m = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`;
    browserApi
      .GET("/v1/public/tenants/{slug}/listings/{listingSlug}/calendar", { params: { path: { slug, listingSlug: listing.slug }, query: { month: m } } })
      .then(({ data }) => {
        if (cancelled || !data) return;
        setUnavailableDays(new Set(data.days.filter((d) => d.available < qty).map((d) => d.date)));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slug, listing.slug, month, qty]);

  // Debounced server-side quote.
  useEffect(() => {
    // All state updates happen inside the debounce callback, never synchronously in the effect body.
    const handle = setTimeout(() => {
      if (!startAt || !endAt) {
        setQuote(undefined);
        setLoading(false);
        return;
      }
      setLoading(true);
      browserApi
        .POST("/v1/public/tenants/{slug}/quotes", {
          params: { path: { slug } },
          body: { items: [{ listingId: listing.id, quantity: qty }], startAt, endAt, fulfillment },
        })
        .then(({ data }) => setQuote(data))
        .catch(() => setQuote(undefined))
        .finally(() => setLoading(false));
    }, 350);
    return () => clearTimeout(handle);
  }, [slug, listing.id, qty, startAt, endAt, fulfillment]);

  const disabledDays = [{ before: new Date() }, (d: Date) => unavailableDays.has(ymd(d))];
  const blocking = quote?.issues.filter((i) => !["MIN_HOURS", "MIN_DAYS"].includes(i.code)) ?? [];
  const ok = Boolean(quote?.ok) && !loading;

  function goToCheckout() {
    if (!ok || !startAt || !endAt) return;
    const qs = new URLSearchParams({ item: listing.slug, start: startAt, end: endAt, qty: String(qty), fulfillment });
    startTransition(() => router.push(`/${slug}/checkout?${qs.toString()}`));
  }

  return (
    <div className="space-y-5 rounded-[var(--radius)] border border-border bg-card p-5 shadow-sm">
      {canHour && canDay ? (
        <div className="grid grid-cols-2 rounded-md bg-muted p-1 text-sm font-medium">
          {(["day", "hour"] as const).map((m) => (
            <button key={m} type="button" onClick={() => setMode(m)} className={`rounded-sm px-3 py-1.5 transition ${mode === m ? "bg-background shadow-sm" : "text-muted-foreground"}`}>
              {formatIDR(m === "day" ? listing.pricePerDay! : listing.pricePerHour!)}
              {m === "day" ? tc("perDay") : tc("perHour")}
            </button>
          ))}
        </div>
      ) : null}

      <div className="flex justify-center">
        {mode === "day" ? (
          <Calendar mode="range" selected={range} onSelect={setRange} disabled={disabledDays} month={month} onMonthChange={setMonth} numberOfMonths={1} locale={locale === "en" ? enGB : idLocale} min={Math.max(1, listing.minDays)} />
        ) : (
          <Calendar mode="single" selected={day} onSelect={setDay} disabled={disabledDays} month={month} onMonthChange={setMonth} locale={locale === "en" ? enGB : idLocale} required={false} />
        )}
      </div>

      {mode === "day" ? (
        <div className="grid gap-1.5">
          <Label htmlFor="pickupTime">{t("time")}</Label>
          <select id="pickupTime" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
            {HOURS.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="startTime">{t("start")}</Label>
            <select id="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
              {HOURS.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="endTime">{t("end")}</Label>
            <select id="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
              {HOURS.filter((h) => h > startTime).map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Label>{t("quantity")}</Label>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="icon-sm" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="-">
            <Minus />
          </Button>
          <span className="w-8 text-center text-sm font-semibold tabular-nums">{qty}</span>
          <Button type="button" variant="outline" size="icon-sm" onClick={() => setQty((q) => Math.min(listing.stockQuantity, q + 1))} disabled={qty >= listing.stockQuantity} aria-label="+">
            <Plus />
          </Button>
        </div>
      </div>

      {deliveryOffered ? (
        <div className="grid gap-2">
          <Label>{t("fulfillment")}</Label>
          <RadioGroup value={fulfillment} onValueChange={(v) => setFulfillment(v as "pickup" | "delivery")} className="grid grid-cols-2 gap-2">
            {(["pickup", "delivery"] as const).map((f) => (
              <label key={f} className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm ${fulfillment === f ? "border-primary bg-accent" : "border-border"}`}>
                <RadioGroupItem value={f} />
                {t(f)}
                {f === "delivery" && settings.deliveryFee > 0 ? <span className="ml-auto text-xs text-muted-foreground">+{formatIDR(settings.deliveryFee)}</span> : null}
              </label>
            ))}
          </RadioGroup>
        </div>
      ) : null}

      <div className="space-y-2 border-t border-border pt-4 text-sm">
        {!startAt ? <p className="text-muted-foreground">{t("chooseDates")}</p> : null}
        {loading ? <p className="text-muted-foreground">{t("checking")}</p> : null}
        {quote && !loading ? (
          <>
            {quote.lines.map((l) => (
              <div key={l.listingId} className="flex justify-between text-muted-foreground">
                <span>
                  {l.quantity} × {l.units} {l.pricingMode === "hour" ? tc("hours") : tc("days")} × {formatIDR(l.unitPrice)}
                </span>
                <span className="text-foreground">{formatIDR(l.lineTotal)}</span>
              </div>
            ))}
            {quote.depositAmount > 0 ? (
              <div className="flex justify-between text-muted-foreground">
                <span>{t("deposit")}</span>
                <span className="text-foreground">{formatIDR(quote.depositAmount)}</span>
              </div>
            ) : null}
            {quote.deliveryFee > 0 ? (
              <div className="flex justify-between text-muted-foreground">
                <span>{t("deliveryFee")}</span>
                <span className="text-foreground">{formatIDR(quote.deliveryFee)}</span>
              </div>
            ) : null}
            <div className="flex justify-between text-base font-semibold">
              <span>{t("total")}</span>
              <span>{formatIDR(quote.total)}</span>
            </div>
            {quote.issues.map((i) => (
              <p key={i.code + (i.listingId ?? "")} className={`text-xs ${["MIN_HOURS", "MIN_DAYS"].includes(i.code) ? "text-muted-foreground" : "text-destructive"}`}>
                {i.message}
              </p>
            ))}
          </>
        ) : null}
      </div>

      <Button type="button" size="lg" className="w-full" disabled={!ok || blocking.length > 0 || pending} onClick={goToCheckout}>
        {t("continue")}
      </Button>
    </div>
  );
}
