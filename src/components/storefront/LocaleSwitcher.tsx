"use client";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLocaleAction } from "@/app/actions/locale";

export function LocaleSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const [pending, start] = useTransition();
  const other = locale === "id" ? "en" : "id";
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await setLocaleAction(other);
          router.refresh();
        })
      }
      className={`inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-50 ${className}`}
      aria-label="Change language"
    >
      <span className={locale === "id" ? "text-foreground" : ""}>ID</span>
      <span aria-hidden>/</span>
      <span className={locale === "en" ? "text-foreground" : ""}>EN</span>
    </button>
  );
}
