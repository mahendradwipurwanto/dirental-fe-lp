import { BlockRenderer } from "@/components/storefront/BlockRenderer";
import type { BlockProps } from "./registry";

const gapClass = { sm: "gap-4", md: "gap-8", lg: "gap-12" } as const;
const alignClass = { top: "items-start", center: "items-center", bottom: "items-end" } as const;
const stackClass = { sm: "sm:[grid-template-columns:var(--cols)]", md: "md:[grid-template-columns:var(--cols)]", never: "[grid-template-columns:var(--cols)]" } as const;
const groupGap = { sm: "gap-3", md: "gap-5", lg: "gap-8" } as const;
const minH = { auto: "", sm: "min-h-[240px]", md: "min-h-[400px]", lg: "min-h-[560px]", screen: "min-h-[85svh]" } as const;
const contentW = { narrow: "max-w-3xl", default: "max-w-6xl", wide: "max-w-7xl" } as const;
const vAlign = { top: "justify-start", center: "justify-center", bottom: "justify-end" } as const;

/** One to four columns; each column holds leaf blocks or a group. */
export function ColumnsBlock({ block, ctx }: BlockProps<"columns">) {
  const n = block.columns.length;
  const ratio = block.ratio.length === n ? block.ratio : block.columns.map(() => 1);
  const template = ratio.map((r) => `minmax(0, ${r}fr)`).join(" ");
  return (
    <div className={`grid ${gapClass[block.gap]} ${alignClass[block.verticalAlign]} ${stackClass[block.stackOn]}`} style={{ "--cols": template } as React.CSSProperties}>
      {block.columns.map((col, i) => (
        <div key={i} className="flex min-w-0 flex-col gap-5">
          <BlockRenderer blocks={col} ctx={{ ...ctx, compact: true }} />
        </div>
      ))}
    </div>
  );
}

/** A free-form section: leaf blocks stacked inside one styled frame (the frame itself comes from BlockFrame). */
export function GroupBlock({ block, ctx }: BlockProps<"group">) {
  return (
    <div className={`flex flex-col ${groupGap[block.gap]} ${minH[block.minHeight]} ${vAlign[block.verticalAlign]} ${ctx.compact ? "" : `block-align ${contentW[block.contentWidth]}`}`}>
      <BlockRenderer blocks={block.children} ctx={{ ...ctx, compact: true }} />
    </div>
  );
}
