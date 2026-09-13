import { Calendar, Check, Clock, Heart, Key, MapPin, Phone, Shield, Sparkles, Star, Truck, Wallet, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { IconName } from "@/lib/site-schema";
import { resolveLink } from "@/lib/storefront/links";
import type { BlockProps } from "./registry";

const icons: Record<IconName, LucideIcon> = { check: Check, star: Star, clock: Clock, shield: Shield, "map-pin": MapPin, truck: Truck, phone: Phone, wallet: Wallet, key: Key, calendar: Calendar, heart: Heart, sparkles: Sparkles };

export function FeaturesBlock({ block }: BlockProps<"features">) {
  if (block.items.length === 0) return null;
  return (
    <div>
      {block.title ? <h2 className="mb-8 text-2xl font-bold tracking-tight md:text-3xl">{block.title}</h2> : null}
      <ul className={`grid gap-x-10 gap-y-7 ${block.columns === 2 ? "md:grid-cols-2" : "sm:grid-cols-2 md:grid-cols-3"}`}>
        {block.items.map((it) => {
          const Icon = icons[it.icon] ?? Check;
          return (
            <li key={it.id} className="flex gap-4">
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-[var(--radius)] bg-accent text-primary">
                <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
              </span>
              <div>
                <h3 className="text-lg font-bold tracking-tight">{it.title}</h3>
                {it.body ? <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">{it.body}</p> : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function FaqBlock({ block }: BlockProps<"faq">) {
  if (block.items.length === 0) return null;
  return (
    <div className="block-align max-w-3xl">
      {block.title ? <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">{block.title}</h2> : null}
      <Accordion multiple={false} className="w-full">
        {block.items.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="text-left text-base">{item.question}</AccordionTrigger>
            <AccordionContent className="whitespace-pre-line text-muted-foreground">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export function TestimonialsBlock({ block }: BlockProps<"testimonials">) {
  if (block.items.length === 0) return null;
  return (
    <div>
      {block.title ? <h2 className="mb-8 text-2xl font-bold tracking-tight md:text-3xl">{block.title}</h2> : null}
      <ul className="grid gap-6 md:grid-cols-3">
        {block.items.map((it) => (
          <li key={it.id} className="flex flex-col gap-4 border-l-2 border-secondary pl-5">
            <blockquote className="text-lg leading-relaxed">“{it.quote}”</blockquote>
            {it.name || it.meta ? (
              <footer className="text-sm">
                <span className="font-semibold">{it.name}</span>
                {it.meta ? <span className="text-muted-foreground"> {it.name ? "—" : ""} {it.meta}</span> : null}
              </footer>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CtaBlock({ block, ctx }: BlockProps<"cta">) {
  const { href, external } = resolveLink(block.ctaKind, block.ctaTarget, ctx.site.tenant);
  const onStrong = block.style.background !== "none" && block.style.background !== "muted" && block.style.background !== "accent";
  const btn = `inline-flex h-12 items-center rounded-[var(--radius)] px-6 text-[15px] font-semibold hover:opacity-90 ${onStrong ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"}`;
  return (
    <div className={`block-align flex max-w-3xl flex-col gap-5 ${block.style.align === "center" ? "items-center" : "items-start"}`}>
      {block.title ? <h2 className="display text-3xl md:text-5xl">{block.title}</h2> : null}
      {block.body ? <p className="text-lg leading-relaxed text-muted-foreground">{block.body}</p> : null}
      {block.ctaLabel ? (
        external ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className={btn}>
            {block.ctaLabel}
          </a>
        ) : (
          <Link href={href} className={btn}>
            {block.ctaLabel}
          </Link>
        )
      ) : null}
    </div>
  );
}

export function StatsBlock({ block }: BlockProps<"stats">) {
  if (block.items.length === 0) return null;
  return (
    <dl className={`grid gap-8 ${block.items.length >= 4 ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2 md:grid-cols-3"}`}>
      {block.items.map((it) => (
        <div key={it.id} className="border-t-2 border-foreground/15 pt-4">
          <dd className="display text-4xl md:text-5xl">{it.value}</dd>
          <dt className="mt-1 text-sm text-muted-foreground">{it.label}</dt>
        </div>
      ))}
    </dl>
  );
}
