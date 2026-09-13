"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type Labels = { owners: string; how?: string; about?: string; faq?: string; browse?: string; login: string; cta: string };

/** Below the `sm` breakpoint the header only has room for the brand and the CTA; the rest lives in this sheet. */
export function LandingMobileNav({ labels, adminUrl, platformName, current }: { labels: Labels; adminUrl: string; platformName: string; current?: "lp" | "directory" | "owners" | "how" | "about" | "faq" }) {
  const [open, setOpen] = useState(false);
  const item = (active = false) => `rounded-lg px-3 py-2.5 text-base font-medium ${active ? "bg-muted text-foreground" : "text-foreground/80 hover:bg-muted"}`;
  return (
    <div className="sm:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Menu" />}>
          <Menu className="h-5 w-5" />
        </SheetTrigger>
        <SheetContent side="right" className="w-[min(20rem,88vw)]">
          <SheetHeader>
            <SheetTitle>{platformName}</SheetTitle>
          </SheetHeader>
          <nav className="mt-2 flex flex-col gap-1 px-4">
            <Link href={labels.browse ? "/" : "/untuk-pemilik-rental"} onClick={() => setOpen(false)} className={item(current === "lp" || current === "owners")}>
              {labels.owners}
            </Link>
            <Link href={labels.browse ? "/browse" : "/cara-kerja"} onClick={() => setOpen(false)} className={item(current === "directory" || current === "how")}>{labels.browse ?? labels.how}</Link>
            {!labels.browse ? <><Link href="/tentang-kami" onClick={() => setOpen(false)} className={item(current === "about")}>{labels.about}</Link><Link href="/faq" onClick={() => setOpen(false)} className={item(current === "faq")}>{labels.faq}</Link></> : null}
            <Link href={`${adminUrl}/login`} className={item(false)}>
              {labels.login}
            </Link>
            <Link href={`${adminUrl}/signup`} className="mt-3 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-4 text-base font-semibold text-primary-foreground hover:bg-primary/90">
              {labels.cta}
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
