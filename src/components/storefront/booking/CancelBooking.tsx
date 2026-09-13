"use client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cancelBookingAction } from "@/lib/booking/actions";

export function CancelBooking({ slug, code, token }: { slug: string; code: string; token: string }) {
  const t = useTranslations("booking");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    setBusy(true);
    setError(null);
    const res = await cancelBookingAction({ slug, code, token, reason });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="sm" className="text-destructive" />}>{t("cancel")}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("cancel")}</DialogTitle>
          <DialogDescription>{t("cancelConfirm")}</DialogDescription>
        </DialogHeader>
        <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder={t("cancelReason")} maxLength={300} rows={3} />
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={busy}>
            {t("title") === "Book" ? "Back" : "Kembali"}
          </Button>
          <Button variant="destructive" onClick={confirm} disabled={busy}>
            {t("cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
