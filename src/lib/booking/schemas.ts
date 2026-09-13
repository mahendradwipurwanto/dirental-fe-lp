import { z } from "zod";

/** `0812…` → `+62812…`; accepts +62 / 62 forms too. */
export function normalizePhone(v: string): string {
  const digits = v.replace(/[^0-9+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("0")) return `+62${digits.slice(1)}`;
  if (digits.startsWith("62")) return `+${digits}`;
  return `+${digits}`;
}

export const phoneSchema = z
  .string()
  .trim()
  .transform(normalizePhone)
  .refine((v) => /^\+[0-9]{9,15}$/.test(v), { message: "invalidPhone" });

export const checkoutSchema = z.object({
  name: z.string().trim().min(2, "required").max(80),
  phone: phoneSchema,
  email: z.string().trim().toLowerCase().email("invalidEmail").max(254),
  notes: z.string().trim().max(1000).optional(),
  fulfillment: z.enum(["pickup", "delivery"]).default("pickup"),
  deliveryAddress: z.string().trim().max(300).optional(),
  agree: z.literal("on", { message: "mustAgree" }),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const quoteParamsSchema = z.object({
  item: z.string().min(1).max(80),
  start: z.string().datetime({ offset: true }),
  end: z.string().datetime({ offset: true }),
  qty: z.coerce.number().int().min(1).max(50).default(1),
  fulfillment: z.enum(["pickup", "delivery"]).default("pickup"),
});
export type QuoteParams = z.infer<typeof quoteParamsSchema>;
