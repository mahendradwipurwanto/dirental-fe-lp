import Link from "next/link";
import { RichText } from "@/components/storefront/RichText";
import { SafeImage } from "@/components/storefront/SafeImage";
import { resolveLink } from "@/lib/storefront/links";
import { ButtonRow } from "./ButtonRow";
import type { BlockProps } from "./registry";

const headingSize = { sm: "text-xl md:text-2xl font-bold tracking-tight", md: "display text-3xl md:text-4xl", lg: "display text-4xl md:text-5xl", xl: "display text-5xl md:text-7xl" } as const;

export function HeadingBlock({ block }: BlockProps<"heading">) {
  const Tag = block.level === 1 ? "h1" : block.level === 3 ? "h3" : "h2";
  return (
    <div className="block-align max-w-3xl">
      <Tag className={headingSize[block.size]}>{block.text}</Tag>
      {block.subtext ? <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{block.subtext}</p> : null}
    </div>
  );
}

export function TextBlock({ block }: BlockProps<"text">) {
  return <RichText doc={block.content} className={`block-align max-w-3xl ${block.size === "lg" ? "text-lg" : "text-[15px]"}`} />;
}

const ratioClass = { auto: "", "16:9": "aspect-[16/9]", "4:3": "aspect-[4/3]", "1:1": "aspect-square", "3:4": "aspect-[3/4]" } as const;
const sizeClass = { full: "w-full", lg: "w-full max-w-4xl", md: "w-full max-w-2xl", sm: "w-full max-w-md" } as const;

export function ImageBlock({ block, ctx }: BlockProps<"image">) {
  if (!block.url) return ctx.mode === "preview" ? <div className="block-align grid aspect-[16/9] w-full max-w-2xl place-items-center rounded-[var(--radius)] border border-dashed border-border text-sm text-muted-foreground">Pilih gambar</div> : null;
  const fixed = block.ratio !== "auto";
  const img = (
    <div className={`relative w-full overflow-hidden bg-muted ${block.rounded ? "rounded-[var(--radius)]" : ""} ${ratioClass[block.ratio]}`}>
      {fixed ? (
        <SafeImage src={block.url} alt={block.alt} fill sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={block.url} alt={block.alt} className="h-auto w-full" loading="lazy" />
      )}
    </div>
  );
  const link = block.linkKind !== "none" ? resolveLink(block.linkKind, block.linkTarget, ctx.site.tenant) : null;
  return (
    <figure className={`block-align ${sizeClass[block.size]}`}>
      {link ? (
        link.external ? (
          <a href={link.href} target="_blank" rel="noopener noreferrer">
            {img}
          </a>
        ) : (
          <Link href={link.href}>{img}</Link>
        )
      ) : (
        img
      )}
      {block.caption ? <figcaption className="mt-2 text-sm text-muted-foreground">{block.caption}</figcaption> : null}
    </figure>
  );
}

export function ButtonBlock({ block, ctx }: BlockProps<"button">) {
  const s = block.style;
  const onDark = Boolean(s.backgroundImageUrl) || s.background === "primary" || s.background === "ink";
  return <ButtonRow buttons={block.buttons} ctx={ctx} onDark={onDark} size={block.size} />;
}

const spacerClass = { sm: "h-6", md: "h-12", lg: "h-24" } as const;

export function SpacerBlock({ block }: BlockProps<"spacer">) {
  return <div className={spacerClass[block.size]} aria-hidden />;
}

export function DividerBlock() {
  return <hr className="border-border" />;
}
