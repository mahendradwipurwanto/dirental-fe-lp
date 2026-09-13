"use client";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { formatIDR } from "@/lib/i18n/format";

type Account = { id: string; bankName: string; accountNumber: string; holderName: string; isPrimary: boolean };

export function BankAccountList({ accounts, total, copyLabel, copiedLabel }: { accounts: Account[]; total: number; copyLabel: string; copiedLabel: string }) {
  const [copied, setCopied] = useState<string | null>(null);
  async function copy(key: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-md bg-muted p-3 text-sm">
        <span className="text-muted-foreground">Total</span>
        <span className="flex items-center gap-2 font-semibold">
          {formatIDR(total)}
          <CopyBtn active={copied === "total"} onClick={() => copy("total", String(total))} copyLabel={copyLabel} copiedLabel={copiedLabel} />
        </span>
      </div>
      <ul className="space-y-2">
        {accounts.map((a) => (
          <li key={a.id} className={`flex items-center justify-between gap-3 rounded-md border p-3 text-sm ${a.isPrimary ? "border-primary/50 bg-accent/40" : "border-border"}`}>
            <div>
              <p className="font-semibold">{a.bankName}</p>
              <p className="text-lg font-bold tabular-nums tracking-wide">{a.accountNumber}</p>
              <p className="text-muted-foreground">a.n. {a.holderName}</p>
            </div>
            <CopyBtn active={copied === a.id} onClick={() => copy(a.id, a.accountNumber.replace(/[^0-9]/g, ""))} copyLabel={copyLabel} copiedLabel={copiedLabel} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function CopyBtn({ active, onClick, copyLabel, copiedLabel }: { active: boolean; onClick: () => void; copyLabel: string; copiedLabel: string }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium hover:bg-muted">
      {active ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
      {active ? copiedLabel : copyLabel}
    </button>
  );
}
