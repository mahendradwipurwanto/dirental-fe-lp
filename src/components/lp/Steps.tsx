/** A real sequence, so numbering carries meaning here. */
export function Steps({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <ol className="mt-10 grid gap-8 md:grid-cols-4 md:gap-6">
      {steps.map((s, i) => (
        <li key={s.title} className="relative border-t-2 border-foreground/15 pt-5">
          <span className="absolute -top-[2px] left-0 h-[2px] w-12 bg-primary" aria-hidden />
          <span className="text-sm font-bold text-primary">{i + 1}</span>
          <h3 className="mt-1 text-lg font-bold leading-snug tracking-tight">{s.title}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}
