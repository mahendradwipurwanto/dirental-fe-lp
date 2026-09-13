"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { apiWithKey, isApiError } from "@/lib/api/client";
import { storeUrls } from "@/lib/storefront/urls";
import { checkoutSchema, quoteParamsSchema } from "./schemas";

export type ActionState = { error?: string; fieldErrors?: Record<string, string> } | null;

async function clientIp(): Promise<string | null> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? null;
}

function messageOf(body: unknown, fallback: string): string {
  return isApiError(body) ? body.error.message : fallback;
}

/** Guest checkout. Reads the quote parameters from hidden fields and the customer details from the form. */
export async function createBookingAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const slug = String(formData.get("slug") ?? "");
  const listingId = String(formData.get("listingId") ?? "");
  const quote = quoteParamsSchema.safeParse({
    item: formData.get("item"),
    start: formData.get("start"),
    end: formData.get("end"),
    qty: formData.get("qty"),
    fulfillment: formData.get("fulfillment") ?? "pickup",
  });
  const form = checkoutSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    notes: formData.get("notes") || undefined,
    fulfillment: formData.get("fulfillment") ?? "pickup",
    deliveryAddress: formData.get("deliveryAddress") || undefined,
    agree: formData.get("agree"),
  });
  if (!quote.success || !slug || !listingId) return { error: "expiredQuote" };
  if (!form.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of form.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
    return { fieldErrors };
  }

  const client = apiWithKey(await clientIp());
  const { data, response } = await client.POST("/v1/public/tenants/{slug}/bookings", {
    params: { path: { slug } },
    body: {
      items: [{ listingId, quantity: quote.data.qty }],
      startAt: quote.data.start,
      endAt: quote.data.end,
      fulfillment: form.data.fulfillment,
      customer: { name: form.data.name, phone: form.data.phone, email: form.data.email, notes: form.data.notes },
      deliveryAddress: form.data.deliveryAddress,
    },
  });
  if (!data) {
    let body: unknown = null;
    try {
      body = await response.clone().json();
    } catch {
      /* ignore */
    }
    return { error: messageOf(body, `HTTP ${response.status}`) };
  }
  redirect(storeUrls.booking(slug, data.code, data.accessToken));
}

export async function attachProofAction(input: { slug: string; code: string; token: string; key: string; senderName?: string; amountClaimed?: number }): Promise<{ ok: true } | { ok: false; error: string }> {
  const client = apiWithKey(await clientIp());
  const { data, response } = await client.POST("/v1/public/tenants/{slug}/bookings/{code}/proof", {
    params: { path: { slug: input.slug, code: input.code } },
    body: { token: input.token, key: input.key, senderName: input.senderName || undefined, amountClaimed: input.amountClaimed || undefined },
  });
  if (data) return { ok: true };
  let body: unknown = null;
  try {
    body = await response.clone().json();
  } catch {
    /* ignore */
  }
  return { ok: false, error: messageOf(body, `HTTP ${response.status}`) };
}

export async function cancelBookingAction(input: { slug: string; code: string; token: string; reason?: string }): Promise<{ ok: true } | { ok: false; error: string }> {
  const client = apiWithKey(await clientIp());
  const { data, response } = await client.POST("/v1/public/tenants/{slug}/bookings/{code}/cancel", {
    params: { path: { slug: input.slug, code: input.code } },
    body: { token: input.token, reason: input.reason || undefined },
  });
  if (data) return { ok: true };
  let body: unknown = null;
  try {
    body = await response.clone().json();
  } catch {
    /* ignore */
  }
  return { ok: false, error: messageOf(body, `HTTP ${response.status}`) };
}
