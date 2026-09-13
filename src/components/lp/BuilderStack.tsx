import { GripVertical } from "lucide-react";
import { BLOCK_META, FONT_FAMILIES, type BlockType } from "@/lib/site-schema";

const swatches = ["#0f766e", "#f2b33d", "#14302b", "#b45309", "#1d4ed8", "#be185d"];

/** The section builder, drawn with the product's real vocabulary (section names, fonts). */
export function BuilderStack() {
  const shown: BlockType[] = ["hero", "listing_grid", "columns", "features", "faq", "contact"];
  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-background p-4 shadow-[0_30px_60px_-40px_rgba(20,48,43,.5)]">
      <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
        <ol className="space-y-2">
          {shown.map((type, i) => (
            <li key={type} className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm ${i === 2 ? "border-primary bg-accent" : "border-border bg-card"}`}>
              <GripVertical className="h-4 w-4 text-muted-foreground/60" />
              <span className="font-semibold">{BLOCK_META[type].label}</span>
              <span className="ml-auto hidden text-xs text-muted-foreground sm:inline">{BLOCK_META[type].description.split(",")[0]}</span>
            </li>
          ))}
        </ol>
        <div className="space-y-3 rounded-lg border border-border bg-card p-3 text-xs">
          <div>
            <p className="mb-1.5 font-semibold">Warna</p>
            <div className="flex flex-wrap gap-1.5">
              {swatches.map((c, i) => (
                <span key={c} className={`h-5 w-5 rounded-full ${i === 0 ? "ring-2 ring-offset-2 ring-primary" : ""}`} style={{ background: c }} />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1.5 font-semibold">Font</p>
            <ul className="space-y-1 text-muted-foreground">
              {FONT_FAMILIES.slice(0, 4).map((f, i) => (
                <li key={f} className={i === 1 ? "text-foreground" : ""}>
                  {f.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
