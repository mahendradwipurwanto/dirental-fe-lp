import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { waLink } from "@/lib/i18n/format";
import type { BlockProps } from "./registry";

function embedUrl(mapUrl: string | undefined): string | null {
  return mapUrl && mapUrl.includes("/maps/embed") ? mapUrl : null;
}

export async function ContactBlock({ block, ctx }: BlockProps<"contact">) {
  const t = await getTranslations("common");
  const c = ctx.site.tenant.contact;
  const map = block.showMap ? embedUrl(c.mapUrl) : null;
  const rows = [
    block.showWhatsapp && c.whatsapp ? { icon: MessageCircle, label: "WhatsApp", value: c.whatsapp, href: waLink(c.whatsapp) } : null,
    block.showPhone && c.phone && c.phone !== c.whatsapp ? { icon: Phone, label: "Telepon", value: c.phone, href: `tel:${c.phone}` } : null,
    block.showEmail && c.email ? { icon: Mail, label: "Email", value: c.email, href: `mailto:${c.email}` } : null,
    block.showAddress && (c.address || c.city) ? { icon: MapPin, label: "Alamat", value: [c.address, c.city].filter(Boolean).join(", "), href: c.mapUrl && !c.mapUrl.includes("/embed") ? c.mapUrl : undefined } : null,
  ].filter(Boolean) as { icon: typeof Phone; label: string; value: string; href?: string }[];

  return (
    <div className={`grid gap-8 ${map ? "md:grid-cols-2" : ""}`}>
      <div className="space-y-5">
        {block.title ? <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{block.title}</h2> : null}
        {block.note ? <p className="text-muted-foreground">{block.note}</p> : null}
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r.label} className="flex items-start gap-3">
              <r.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">{r.label}</p>
                {r.href ? (
                  <a href={r.href} target={r.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="font-medium hover:underline">
                    {r.value}
                  </a>
                ) : (
                  <p className="font-medium">{r.value}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
        {block.showWhatsapp && c.whatsapp ? (
          <a href={waLink(c.whatsapp)} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center rounded-[var(--radius)] bg-primary px-6 text-[15px] font-semibold text-primary-foreground hover:opacity-90">
            {t("whatsapp")}
          </a>
        ) : null}
      </div>
      {map ? (
        <div className="overflow-hidden rounded-[var(--radius)] border border-border">
          <iframe src={map} title="Map" className="h-72 w-full md:h-full md:min-h-[320px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
        </div>
      ) : null}
    </div>
  );
}
