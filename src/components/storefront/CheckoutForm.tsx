"use client";
import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createBookingAction, type ActionState } from "@/lib/booking/actions";
import type { QuoteParams } from "@/lib/booking/schemas";

export function CheckoutForm({ slug, listingId, quote, deliveryOffered }: { slug: string; listingId: string; quote: QuoteParams; deliveryOffered: boolean }) {
  const t = useTranslations("booking");
  const [state, action, pending] = useActionState<ActionState, FormData>(createBookingAction, null);
  const err = (field: string) => {
    const key = state?.fieldErrors?.[field];
    if (!key) return null;
    const known = ["required", "invalidPhone", "invalidEmail", "mustAgree"];
    return <p className="text-xs text-destructive">{known.includes(key) ? t(key as "required") : key}</p>;
  };

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="listingId" value={listingId} />
      <input type="hidden" name="item" value={quote.item} />
      <input type="hidden" name="start" value={quote.start} />
      <input type="hidden" name="end" value={quote.end} />
      <input type="hidden" name="qty" value={quote.qty} />
      <input type="hidden" name="fulfillment" value={quote.fulfillment} />

      <div className="grid gap-1.5">
        <Label htmlFor="name">{t("name")}</Label>
        <Input id="name" name="name" required minLength={2} maxLength={80} autoComplete="name" />
        {err("name")}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="phone">{t("phone")}</Label>
          <Input id="phone" name="phone" type="tel" inputMode="tel" required placeholder="0812xxxxxxx" autoComplete="tel" />
          {err("phone")}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="email">{t("email")}</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
          {err("email")}
        </div>
      </div>
      {deliveryOffered ? (
        <div className="grid gap-1.5">
          <Label htmlFor="deliveryAddress">{t("deliveryAddress")}</Label>
          <Textarea id="deliveryAddress" name="deliveryAddress" required maxLength={300} rows={3} />
          {err("deliveryAddress")}
        </div>
      ) : null}
      <div className="grid gap-1.5">
        <Label htmlFor="notes">{t("notes")}</Label>
        <Textarea id="notes" name="notes" maxLength={1000} rows={3} />
      </div>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="agree" required className="mt-1 h-4 w-4 accent-[var(--primary)]" />
        <span>{t("agree")}</span>
      </label>
      {err("agree")}
      {state?.error ? <p className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{state.error === "expiredQuote" ? t("expiredQuote") : t("createFailed", { message: state.error })}</p> : null}
      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={pending}>
        {pending ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
