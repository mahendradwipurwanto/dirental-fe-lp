import { Check } from "lucide-react";

const STAGES = ["pending_payment", "awaiting_verification", "confirmed", "active", "completed"] as const;
type Stage = (typeof STAGES)[number];
type Status = Stage | "cancelled" | "expired" | "rejected";

/**
 * The booking's path as a horizontal timeline. Terminal failures (cancelled, expired, rejected)
 * are shown as where the path stopped, not as a sixth stage.
 */
export function StatusTimeline({ status, labels }: { status: Status; labels: Record<Status, string> }) {
  const stopped = status === "cancelled" || status === "expired" || status === "rejected";
  const currentIndex = stopped ? (status === "rejected" ? 1 : 0) : STAGES.indexOf(status);
  return (
    <ol className="grid grid-cols-5 gap-1" aria-label={labels[status]}>
      {STAGES.map((stage, i) => {
        const done = i < currentIndex || (!stopped && i === currentIndex && stage === "completed");
        const active = i === currentIndex;
        const tone = stopped && active ? "bg-destructive" : done ? "bg-primary" : active ? "bg-primary" : "bg-border";
        return (
          <li key={stage} className="min-w-0">
            <div className={`h-1.5 rounded-full ${tone} ${active && !stopped ? "ring-4 ring-primary/20" : ""}`} />
            <p className={`mt-2 hidden truncate text-[11px] leading-tight sm:block ${active ? "font-semibold text-foreground" : done ? "text-foreground/70" : "text-muted-foreground"}`}>
              {done && !active ? (
                <span className="inline-flex items-center gap-1">
                  <Check className="h-3 w-3" strokeWidth={3} />
                  {labels[stage]}
                </span>
              ) : (
                labels[stage]
              )}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
