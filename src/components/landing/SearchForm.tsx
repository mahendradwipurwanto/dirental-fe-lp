import { Search } from "lucide-react";

export function SearchForm({ placeholder, buttonLabel, defaultValue, className = "", size = "md" }: { placeholder: string; buttonLabel: string; defaultValue?: string; className?: string; size?: "md" | "lg" }) {
  const h = size === "lg" ? "h-13" : "h-11";
  return (
    <form action="/search" className={`flex gap-2 ${className}`} role="search">
      <label className="relative flex-1">
        <span className="sr-only">{placeholder}</span>
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input name="q" defaultValue={defaultValue} placeholder={placeholder} className={`${h} w-full rounded-lg border border-input bg-card pl-10 pr-3 text-[15px] outline-none placeholder:text-muted-foreground/80 focus-visible:ring-2 focus-visible:ring-ring`} />
      </label>
      <button type="submit" className={`${h} rounded-lg bg-foreground px-5 text-sm font-semibold text-background hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`}>
        {buttonLabel}
      </button>
    </form>
  );
}
