import { SafeImage } from "@/components/storefront/SafeImage";
import { getDirectory, getListings, getSite } from "@/lib/api/storefront";
import { formatIDR } from "@/lib/i18n/format";
import { homePage } from "@/lib/site-schema";
import { contrastText } from "@/lib/theme/css-vars";

/**
 * A real storefront, miniaturised: the first active tenant's theme, name and two of its items.
 * Falls back to a sample store when the directory is empty, so the page never shows lorem ipsum.
 */
export async function PhoneMock({ host, yourStore }: { host: string; yourStore: string }) {
  const [first] = await getDirectory(undefined, 1);
  const site = first ? await getSite(first.slug) : null;
  const { items } = first ? await getListings(first.slug, { limit: 2 }) : { items: [] };

  const name = site?.tenant.name ?? "Sewa Motor Kuta";
  const slug = site?.tenant.slug ?? "sewa-motor-kuta";
  const theme = site?.config?.theme ?? { primary: "#0f766e", secondary: "#f2b33d", background: "#ffffff", foreground: "#14302b" };
  const hero = site?.config ? homePage(site.config).blocks.find((b) => b.type === "hero") : undefined;
  const title = (hero && hero.type === "hero" && hero.title) || name;
  const subtitle = (hero && hero.type === "hero" && hero.subtitle) || site?.tenant.tagline || "";
  const cards =
    items.length > 0
      ? items.map((i) => ({ id: i.id, name: i.name, img: i.images[0]?.url ?? null, price: i.pricePerDay ?? i.pricePerHour ?? 0, unit: i.pricePerDay != null ? "/hari" : "/jam" }))
      : [
          { id: "a", name: "Honda Vario 160", img: null, price: 90_000, unit: "/hari" },
          { id: "b", name: "Yamaha NMAX", img: null, price: 120_000, unit: "/hari" },
        ];
  const onPrimary = contrastText(theme.primary);

  return (
    <div className="relative mx-auto w-[290px] sm:w-[320px]">
      {/* Hang tag with the store's own link: the product promise, literally attached to the phone. */}
      <div className="tag-punched absolute -top-6 right-2 z-10 rotate-[8deg] rounded-md bg-marigold py-2 pr-3 text-[13px] font-bold text-ink shadow-[0_6px_20px_-8px_rgba(20,48,43,.45)] sm:-right-8 sm:top-10">
        {host}/{slug}
        <span className="block text-[11px] font-medium text-ink/70">{yourStore}</span>
      </div>

      <div className="rounded-[2.4rem] border-[7px] border-ink bg-ink shadow-[0_30px_60px_-30px_rgba(20,48,43,.55)]">
        <div className="overflow-hidden rounded-[1.9rem]" style={{ background: theme.background, color: theme.foreground }}>
          <div className="mx-auto mt-2 h-5 w-24 rounded-full bg-ink" aria-hidden />
          {/* mini header */}
          <div className="flex items-center gap-2 px-4 pb-3 pt-3">
            <span className="grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold" style={{ background: theme.primary, color: onPrimary }}>
              {name.slice(0, 1)}
            </span>
            <span className="truncate text-[12px] font-bold">{name}</span>
            <span className="ml-auto rounded-full px-2 py-0.5 text-[9px] font-semibold" style={{ background: theme.primary, color: onPrimary }}>
              WhatsApp
            </span>
          </div>
          {/* mini hero */}
          <div className="mx-3 rounded-xl px-4 py-5" style={{ background: theme.primary, color: onPrimary }}>
            <p className="text-[17px] font-extrabold leading-tight">{title}</p>
            {subtitle ? <p className="mt-1 line-clamp-2 text-[10px] opacity-85">{subtitle}</p> : null}
          </div>
          {/* mini cards */}
          <div className="grid grid-cols-2 gap-2 px-3 pb-4 pt-3">
            {cards.map((c) => (
              <div key={c.id} className="overflow-hidden rounded-lg border" style={{ borderColor: `color-mix(in oklab, ${theme.foreground} 12%, ${theme.background})` }}>
                <div className="relative aspect-[4/3]" style={{ background: `color-mix(in oklab, ${theme.foreground} 8%, ${theme.background})` }}>
                  {c.img ? <SafeImage src={c.img} alt="" fill sizes="140px" className="object-cover" /> : null}
                </div>
                <div className="p-2">
                  <p className="truncate text-[10px] font-semibold">{c.name}</p>
                  <p className="tag-punched-sm mt-1 inline-block rounded py-0.5 pr-1.5 text-[9px] font-bold" style={{ background: theme.secondary, color: contrastText(theme.secondary) }}>
                    {formatIDR(c.price)}
                    {c.unit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
