import { Check } from "lucide-react";

/** Three-step indicator for the customer journey; a genuine sequence, so it is numbered. */
export function CheckoutSteps({ labels, current }: { labels: [string, string, string]; current: 1 | 2 | 3 }) {
  return (
    <ol className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
      {labels.map((label, i) => {
        const n = (i + 1) as 1 | 2 | 3;
        const done = n < current;
        const active = n === current;
        return (
          <li key={label} className={`flex items-center gap-2 ${active ? "font-semibold text-foreground" : done ? "text-foreground/70" : "text-muted-foreground"}`}>
            <span className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold ${done ? "bg-primary text-primary-foreground" : active ? "border-2 border-primary text-primary" : "border border-border"}`}>
              {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : n}
            </span>
            {label}
          </li>
        );
      })}
    </ol>
  );
}
