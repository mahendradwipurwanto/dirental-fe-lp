import Link from "next/link";
import { LocaleSwitcher } from "@/components/storefront/LocaleSwitcher";
import { ADMIN_URL, PLATFORM_NAME } from "@/lib/platform";

export function LandingFooter({ labels }: { labels: { tagline: string; owners: string; how?: string; about?: string; faq?: string; browse?: string; login: string } }) {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-6 px-5 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div className="max-w-sm">
          <p className="text-base font-bold tracking-tight">{PLATFORM_NAME}</p>
          <p className="mt-1 text-sm text-muted-foreground">{labels.tagline}</p>
          <p className="mt-4 text-xs text-muted-foreground">© {new Date().getFullYear()}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <Link href={labels.browse ? "/" : "/untuk-pemilik-rental"} className="text-muted-foreground hover:text-foreground">
            {labels.owners}
          </Link>
          <Link href={labels.browse ? "/browse" : "/cara-kerja"} className="text-muted-foreground hover:text-foreground">{labels.browse ?? labels.how}</Link>
          {!labels.browse ? <><Link href="/tentang-kami" className="text-muted-foreground hover:text-foreground">{labels.about}</Link><Link href="/faq" className="text-muted-foreground hover:text-foreground">{labels.faq}</Link></> : null}
          <Link href={`${ADMIN_URL}/login`} className="text-muted-foreground hover:text-foreground">
            {labels.login}
          </Link>
          <LocaleSwitcher />
        </div>
      </div>
    </footer>
  );
}
