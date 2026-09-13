export const TZ = "Asia/Jakarta";

export function formatIDR(amount: number, currency = "IDR"): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

const intlLocale = (locale: string) => (locale === "en" ? "en-GB" : "id-ID");

export function formatDateTime(d: Date | string, locale = "id", opts: Intl.DateTimeFormatOptions = {}): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    timeZone: TZ,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    ...opts,
  }).format(typeof d === "string" ? new Date(d) : d);
}

export function formatDate(d: Date | string, locale = "id"): string {
  return new Intl.DateTimeFormat(intlLocale(locale), { timeZone: TZ, day: "numeric", month: "short", year: "numeric" }).format(typeof d === "string" ? new Date(d) : d);
}

export function formatTime(d: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: false }).format(typeof d === "string" ? new Date(d) : d);
}

/** `2026-09-10` + `09:00` in Asia/Jakarta → ISO instant. */
export function jakartaToIso(date: string, time: string): string {
  return new Date(`${date}T${time}:00+07:00`).toISOString();
}

/** ISO instant → { date: 'YYYY-MM-DD', time: 'HH:mm' } in Asia/Jakarta. */
export function isoToJakarta(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return { date: `${get("year")}-${get("month")}-${get("day")}`, time: `${get("hour") === "24" ? "00" : get("hour")}:${get("minute")}` };
}

export function todayJakarta(): string {
  return isoToJakarta(new Date().toISOString()).date;
}

/** Formats a WhatsApp deep link with an optional prefilled message. */
export function waLink(phone: string, text?: string): string {
  const digits = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
