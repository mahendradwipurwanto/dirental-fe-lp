"use client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { browserApi } from "@/lib/api/browser";
import { attachProofAction } from "@/lib/booking/actions";

type Account = { id: string; bankName: string; accountNumber: string };

/**
 * Upload flow: ask the API for a presigned PUT URL (private storage), upload straight from the browser,
 * then record the object key through a Server Action so the API verifies it.
 */
export function ProofUploader({ slug, code, token, bankAccounts }: { slug: string; code: string; token: string; bankAccounts: Account[] }) {
  const t = useTranslations("booking");
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [senderName, setSenderName] = useState("");
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const { data: presigned, error: presignError } = await browserApi.POST("/v1/public/tenants/{slug}/bookings/{code}/proof-presign", {
        params: { path: { slug, code } },
        body: { token, filename: file.name, contentType: file.type || "application/octet-stream", size: file.size },
      });
      if (!presigned) throw new Error((presignError as { error?: { message?: string } } | undefined)?.error?.message ?? "presign failed");
      const put = await fetch(presigned.uploadUrl, { method: presigned.method, headers: presigned.headers, body: file });
      if (!put.ok) throw new Error(`upload failed (${put.status})`);
      const res = await attachProofAction({
        slug,
        code,
        token,
        key: presigned.key,
        senderName: senderName || undefined,
        amountClaimed: amount ? Number(amount.replace(/[^0-9]/g, "")) : undefined,
      });
      if (!res.ok) throw new Error(res.error);
      setDone(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  if (done) return <p className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-900">{t("uploaded")}</p>;

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-1.5">
        <Label htmlFor="proof">{t("uploadProof")}</Label>
        <Input id="proof" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" required onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <p className="text-xs text-muted-foreground">{t("uploadHint")}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="senderName">{t("senderName")}</Label>
          <Input id="senderName" value={senderName} onChange={(e) => setSenderName(e.target.value)} maxLength={80} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="amount">{t("amount")}</Label>
          <Input id="amount" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Rp" />
        </div>
      </div>
      {bankAccounts.length > 1 ? <p className="text-xs text-muted-foreground">{bankAccounts.map((a) => a.bankName).join(" / ")}</p> : null}
      {error ? <p className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{t("uploadFailed", { message: error })}</p> : null}
      <Button type="submit" disabled={!file || busy}>
        {busy ? t("uploading") : t("uploadProof")}
      </Button>
    </form>
  );
}
