import { CalendarCheck, Clock, Link2, Mail, ReceiptText, Users } from "lucide-react";

const icons = { link: Link2, calendar: CalendarCheck, transfer: ReceiptText, expiry: Clock, mail: Mail, team: Users } as const;

/** A two-column list, not a card grid: each feature is one sentence with a small glyph. */
export function FeatureList({ items }: { items: { key: keyof typeof icons; title: string; body: string }[] }) {
  return (
    <ul className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
      {items.map((f) => {
        const Icon = icons[f.key];
        return (
          <li key={f.key} className="flex gap-4">
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent text-primary">
              <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
            </span>
            <div>
              <h3 className="text-lg font-bold tracking-tight">{f.title}</h3>
              <p className="mt-1 max-w-md text-[15px] leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
