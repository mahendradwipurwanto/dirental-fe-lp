import { RichText } from "@/components/storefront/RichText";
import { SafeImage } from "@/components/storefront/SafeImage";
import { ButtonRow } from "./ButtonRow";
import type { BlockProps } from "./registry";

const heights = { sm: "min-h-[320px] md:min-h-[380px]", md: "min-h-[440px] md:min-h-[540px]", lg: "min-h-[560px] md:min-h-[680px]", screen: "min-h-[85svh]" } as const;

/**
 * Three layouts: `cover` (text over a darkened image), `split` (text beside an image), `plain` (text only,
 * on the tenant's primary colour unless the block style says otherwise). Text lines are all optional.
 */
export function HeroBlock({ block, ctx }: BlockProps<"hero">) {
  const center = block.style.align === "center";
  const layout = block.imageUrl ? block.layout : "plain";
  const hasStyleSurface = block.style.background !== "none" || Boolean(block.style.backgroundImageUrl);
  const onDark = layout === "cover" || block.style.background === "primary" || block.style.background === "ink" || (layout === "plain" && !hasStyleSurface);

  const titleSize = layout === "split" ? "text-4xl sm:text-5xl md:text-6xl" : "text-4xl sm:text-5xl md:text-7xl";
  const text = (
    <>
      {block.eyebrow ? <p className={`text-sm font-semibold ${onDark ? "opacity-85" : "text-primary"}`}>{block.eyebrow}</p> : null}
      {block.title ? <h1 className={`display max-w-4xl ${titleSize}`}>{block.title}</h1> : null}
      {block.subtitle ? <p className="max-w-2xl text-lg leading-relaxed opacity-85 md:text-xl">{block.subtitle}</p> : null}
      <RichText doc={block.body} className="max-w-2xl opacity-90" />
      <ButtonRow buttons={block.buttons} ctx={ctx} onDark={onDark} size="lg" className={center ? "justify-center" : ""} />
    </>
  );

  if (layout === "cover") {
    return (
      <div className={`relative overflow-hidden ${heights[block.height]}`}>
        <SafeImage src={block.imageUrl} alt={block.imageAlt} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(0,0,0,${Math.min(0.9, block.overlay / 100 + 0.25)}), rgba(0,0,0,${block.overlay / 100}) 55%, rgba(0,0,0,${Math.max(0, block.overlay / 100 - 0.3)}))` }} />
        <div className={`relative mx-auto flex max-w-6xl flex-col justify-end gap-5 px-4 py-14 text-white sm:px-6 md:py-20 ${heights[block.height]} ${center ? "items-center text-center" : "items-start"}`}>{text}</div>
      </div>
    );
  }

  if (layout === "split") {
    return (
      <div className={`${!hasStyleSurface ? "bg-background text-foreground" : ""}`}>
        <div className={`mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20 ${heights[block.height]}`}>
          <div className={`flex flex-col gap-5 ${center ? "items-center text-center" : "items-start"} ${block.imagePosition === "left" ? "md:order-2" : ""}`}>{text}</div>
          <div className={`relative aspect-[4/3] overflow-hidden rounded-[var(--radius)] bg-muted ${block.imagePosition === "left" ? "md:order-1" : ""}`}>
            <SafeImage src={block.imageUrl} alt={block.imageAlt} fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={!hasStyleSurface ? "bg-primary text-primary-foreground" : ""}>
      <div className={`mx-auto flex max-w-6xl flex-col justify-center gap-5 px-4 py-20 sm:px-6 md:py-28 ${heights[block.height]} ${center ? "items-center text-center" : "items-start"}`}>{text}</div>
    </div>
  );
}
