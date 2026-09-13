import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { LandingMobileNav } from "@/components/landing/LandingMobileNav";
import { ADMIN_URL, PLATFORM_NAME } from "@/lib/platform";

export function LandingHeader({ labels, current }: { labels: { owners: string; how?: string; about?: string; faq?: string; browse?: string; login: string; cta: string }; current?: "lp" | "directory" | "owners" | "how" | "about" | "faq" }) {
  const link = (active = false) => `hidden rounded-md px-3 py-2 hover:bg-muted sm:inline-block ${active ? "text-foreground" : "text-muted-foreground"}`;
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center gap-3 px-4 sm:gap-6 sm:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2.5 text-[15px] font-bold tracking-tight">
          <BrandMark />
          <span className="truncate">{PLATFORM_NAME}</span>
        </Link>
        <nav className="ml-auto flex shrink-0 items-center gap-1 text-sm font-medium">
          <Link href={labels.browse ? "/" : "/untuk-pemilik-rental"} className={link(current === "lp" || current === "owners")}>
            {labels.owners}
          </Link>
          <Link href={labels.browse ? "/browse" : "/cara-kerja"} className={link(current === "directory" || current === "how")}>{labels.browse ?? labels.how}</Link>
          {!labels.browse ? <><Link href="/tentang-kami" className={link(current === "about")}>{labels.about}</Link><Link href="/faq" className={link(current === "faq")}>{labels.faq}</Link></> : null}
          <Link href={`${ADMIN_URL}/login`} className="hidden whitespace-nowrap rounded-md px-3 py-2 text-muted-foreground hover:bg-muted sm:inline-block">
            {labels.login}
          </Link>
          <Link href={`${ADMIN_URL}/signup`} className="ml-1 whitespace-nowrap rounded-md bg-primary px-3.5 py-2 text-primary-foreground hover:bg-primary/90">
            {labels.cta}
          </Link>
          {/* Phones: owners / browse / login move into a sheet so the CTA never gets clipped. */}
          <LandingMobileNav labels={labels} adminUrl={ADMIN_URL} platformName={PLATFORM_NAME} current={current} />
        </nav>
      </div>
    </header>
  );
}
