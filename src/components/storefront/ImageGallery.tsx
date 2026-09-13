"use client";
import { useState } from "react";
import { SafeImage } from "./SafeImage";

type Img = { id: string; url: string; alt: string | null };

export function ImageGallery({ images, name }: { images: Img[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];
  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius)] bg-muted">
        {current ? <SafeImage src={current.url} alt={current.alt ?? name} fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" /> : null}
      </div>
      {images.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button key={img.id} type="button" onClick={() => setActive(i)} className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-md border-2 ${i === active ? "border-primary" : "border-transparent"}`} aria-label={`Image ${i + 1}`}>
              <SafeImage src={img.url} alt={img.alt ?? ""} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
