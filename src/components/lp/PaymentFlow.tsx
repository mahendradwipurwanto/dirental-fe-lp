type Step = { status: string; body: string; actor: "customer" | "owner" | "system" };

/** The booking status vocabulary customers and owners will actually see, in order. */
export function PaymentFlow({ steps, customer, owner, system, note }: { steps: Step[]; customer: string; owner: string; system: string; note: string }) {
  const actorLabel = { customer, owner, system };
  return (
    <div className="mt-10">
      <ol className="grid gap-6 md:grid-cols-4 md:gap-4">
        {steps.map((s, i) => (
          <li key={s.status} className="relative">
            <div className="flex items-center gap-3">
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold ${i === steps.length - 1 ? "bg-primary text-primary-foreground" : "bg-ink text-white"}`}>{i + 1}</span>
              {i < steps.length - 1 ? <span className="hidden h-px flex-1 bg-border md:block" aria-hidden /> : null}
            </div>
            <p className="mt-4 text-xs font-semibold text-muted-foreground">{actorLabel[s.actor]}</p>
            <p className="mt-1 text-lg font-bold tracking-tight">{s.status}</p>
            <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">{s.body}</p>
          </li>
        ))}
      </ol>
      <p className="mt-8 max-w-2xl rounded-lg bg-accent px-4 py-3 text-sm text-foreground/80">{note}</p>
    </div>
  );
}
