import { SafeImage } from "@/components/storefront/SafeImage";
import type { BlockProps } from "./registry";

const cols: Record<number, string> = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 md:grid-cols-3", 4: "sm:grid-cols-2 md:grid-cols-4" };

export function GalleryBlock({ block }: BlockProps<"gallery">) {
  if (block.images.length === 0) return null;
  return (
    <div>
      {block.title ? <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">{block.title}</h2> : null}
      <div className={`grid gap-3 ${cols[block.columns] ?? cols[3]}`}>
        {block.images.map((img, i) => (
          <div key={`${img.url}-${i}`} className="relative aspect-square overflow-hidden rounded-[var(--radius)] bg-muted">
            <SafeImage src={img.url} alt={img.alt} fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

const mapHeight = { sm: "h-56", md: "h-80", lg: "h-[520px]" } as const;

export function MapBlock({ block, ctx }: BlockProps<"map">) {
  const src = block.embedUrl || ctx.site.tenant.contact.mapUrl || "";
  if (!src.includes("/maps/embed")) {
    return ctx.mode === "preview" ? <p className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Tempel tautan “embed” dari Google Maps.</p> : null;
  }
  return (
    <div className="overflow-hidden rounded-[var(--radius)] border border-border">
      <iframe src={src} title="Map" className={`w-full ${mapHeight[block.height]}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
    </div>
  );
}

function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  return m?.[1] ?? null;
}

export function VideoBlock({ block, ctx }: BlockProps<"video">) {
  const id = block.url ? youtubeId(block.url) : null;
  if (!id) {
    return ctx.mode === "preview" ? <p className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Tempel tautan video YouTube.</p> : null;
  }
  return (
    <figure className="block-align w-full max-w-4xl">
      <div className="relative aspect-video overflow-hidden rounded-[var(--radius)] bg-black">
        <iframe src={`https://www.youtube-nocookie.com/embed/${id}`} title={block.caption || "Video"} className="absolute inset-0 h-full w-full" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
      {block.caption ? <figcaption className="mt-2 text-sm text-muted-foreground">{block.caption}</figcaption> : null}
    </figure>
  );
}
