import type { CSSProperties } from "react";
import type { Site } from "@/lib/api/storefront";
import { blockSchema, type Block, type BlockStyle } from "@/lib/site-schema";
import { contrastText } from "@/lib/theme/css-vars";
import { blockRegistry } from "@/components/blocks/registry";

export type RenderMode = "live" | "preview";
export type BlockCtx = { site: Site; mode: RenderMode; compact?: boolean };

const paddingClass: Record<BlockStyle["paddingY"], string> = { none: "py-0", sm: "py-6 md:py-8", md: "py-12 md:py-16", lg: "py-20 md:py-28", xl: "py-28 md:py-40" };
const widthClass: Record<BlockStyle["width"], string> = { narrow: "max-w-3xl", default: "max-w-6xl", wide: "max-w-7xl", full: "max-w-none" };
const backgroundClass: Record<BlockStyle["background"], string> = {
  none: "",
  muted: "bg-muted",
  accent: "bg-accent",
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  ink: "bg-foreground text-background",
  custom: "",
};

/** Whether the block's text should be treated as sitting on a dark/strong surface. */
function isStrong(s: BlockStyle): boolean {
  if (s.backgroundImageUrl) return true;
  return s.background === "primary" || s.background === "ink" || s.background === "secondary" || (s.background === "custom" && contrastText(s.customColor) === "#ffffff");
}

/**
 * Resolves the effective text colour and re-points the muted/border tokens at it so components inside
 * the block stay legible on any background (colour, custom colour or image).
 */
function frameVars(s: BlockStyle, theme: { background: string; foreground: string } | undefined): CSSProperties {
  const vars: Record<string, string> = {};
  let text: string | undefined;
  if (s.textColor === "light") text = "#ffffff";
  else if (s.textColor === "dark") text = theme?.foreground ?? "#14302b";
  else if (s.textColor === "custom") text = s.customTextColor;
  else if (s.backgroundImageUrl) text = "#ffffff";
  else if (s.background === "custom") text = contrastText(s.customColor);
  else if (s.background === "ink") text = theme?.background ?? "#ffffff";
  else if (s.background === "primary") text = "var(--primary-foreground)";
  else if (s.background === "secondary") text = "var(--secondary-foreground)";

  if (s.background === "custom") vars.backgroundColor = s.customColor;
  if (text) {
    Object.assign(vars, {
      color: text,
      "--foreground": text,
      "--muted-foreground": "color-mix(in oklab, currentColor 72%, transparent)",
      "--border": "color-mix(in oklab, currentColor 22%, transparent)",
      "--card": "color-mix(in oklab, currentColor 8%, transparent)",
      "--card-foreground": "currentColor",
      "--accent": "color-mix(in oklab, currentColor 12%, transparent)",
      "--accent-foreground": "currentColor",
    });
  }
  return vars as CSSProperties;
}

function BackgroundImage({ s }: { s: BlockStyle }) {
  if (!s.backgroundImageUrl) return null;
  return (
    <>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${s.backgroundImageUrl}")` }} aria-hidden />
      <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${s.backgroundOverlay / 100})` }} aria-hidden />
    </>
  );
}

/** Applies the shared block style: background colour or image, vertical padding, content width, alignment. */
export function BlockFrame({ block, ctx, children }: { block: Block; ctx: BlockCtx; children: React.ReactNode }) {
  const s = block.style;
  const align = s.align === "center" ? "text-center [&_.block-align]:mx-auto [&_.block-align]:justify-center" : "";
  const vars = frameVars(s, ctx.site.config?.theme);
  const hasBg = s.background !== "none" || Boolean(s.backgroundImageUrl);
  const dataAttrs = { id: block.id, "data-block-id": ctx.mode === "preview" ? block.id : undefined, "data-block-type": block.type, "data-strong": isStrong(s) ? "true" : undefined };

  if (ctx.compact) {
    return (
      <div {...dataAttrs} className={`relative scroll-mt-24 ${align} ${backgroundClass[s.background]} ${hasBg ? "overflow-hidden rounded-[var(--radius)] p-5" : ""}`} style={vars}>
        <BackgroundImage s={s} />
        <div className="relative">{children}</div>
      </div>
    );
  }
  const full = s.width === "full";
  return (
    <section {...dataAttrs} className={`relative scroll-mt-20 ${backgroundClass[s.background]} ${align}`} style={vars}>
      <BackgroundImage s={s} />
      <div className={`relative ${full ? "" : `mx-auto px-4 sm:px-6 ${widthClass[s.width]}`} ${paddingClass[s.paddingY]}`}>{children}</div>
    </section>
  );
}

/**
 * Renders an ordered block list. Each block is re-validated so a bad entry in an older draft is
 * skipped (or shown as an error box in preview) instead of breaking the page.
 */
export function BlockRenderer({ blocks, ctx }: { blocks: Block[]; ctx: BlockCtx }) {
  return (
    <>
      {blocks.map((raw, i) => {
        const parsed = blockSchema.safeParse(raw);
        if (!parsed.success) {
          if (ctx.mode !== "preview") return null;
          return (
            <div key={i} className="mx-auto my-4 max-w-6xl rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-700">
              Block #{i + 1} could not be rendered: {parsed.error.issues.map((x) => x.message).join(", ")}
            </div>
          );
        }
        const block = parsed.data;
        if (block.hidden && ctx.mode !== "preview") return null;
        const Cmp = blockRegistry[block.type] as React.ComponentType<{ block: Block; ctx: BlockCtx }>;
        return (
          <div key={block.id} className={block.hidden ? "opacity-40" : ""}>
            <BlockFrame block={block} ctx={ctx}>
              <Cmp block={block} ctx={ctx} />
            </BlockFrame>
          </div>
        );
      })}
    </>
  );
}
