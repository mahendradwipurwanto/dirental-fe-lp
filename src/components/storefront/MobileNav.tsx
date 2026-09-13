"use client";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type L = { id: string; label: string; href: string; external: boolean };

export function MobileNav({ links, whatsappHref, whatsappLabel, tenantName }: { links: L[]; whatsappHref: string | null; whatsappLabel: string; tenantName: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ml-auto md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Menu" />}>
          <Menu className="h-5 w-5" />
        </SheetTrigger>
        <SheetContent side="right" className="w-72">
          <SheetHeader>
            <SheetTitle>{tenantName}</SheetTitle>
          </SheetHeader>
          <nav className="mt-4 flex flex-col gap-1 px-4">
            {links.map((l) => (
              <Link key={l.id} href={l.href} onClick={() => setOpen(false)} target={l.external ? "_blank" : undefined} className="rounded-md px-3 py-2 text-base font-medium hover:bg-accent">
                {l.label}
              </Link>
            ))}
            {whatsappHref ? (
              <Button className="mt-3" nativeButton={false} render={<a href={whatsappHref} target="_blank" rel="noopener noreferrer" />}>
                {whatsappLabel}
              </Button>
            ) : null}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
