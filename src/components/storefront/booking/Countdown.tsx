"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/** Counts down to `expiresAt`, corrected for client clock skew using the server's `now`. */
export function Countdown({ expiresAt, serverTime, label, expiredLabel }: { expiresAt: string; serverTime: string; label: string; expiredLabel: string }) {
  const router = useRouter();
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const target = new Date(expiresAt).getTime();
    const skew = Date.now() - new Date(serverTime).getTime();
    const tick = () => {
      const remaining = target - (Date.now() - skew);
      setLeft(remaining);
      if (remaining <= 0) {
        clearInterval(id);
        router.refresh();
      }
    };
    // First tick is deferred so no state update happens synchronously inside the effect body.
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [expiresAt, serverTime, router]);

  if (left === null) return <span className="text-sm font-bold tabular-nums">{label}: --:--</span>;
  if (left <= 0) return <span className="text-sm font-bold">{expiredLabel}</span>;
  const s = Math.floor(left / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return (
    <span className="text-sm font-bold tabular-nums">
      {label}: {h > 0 ? `${h}:` : ""}
      {String(m).padStart(2, "0")}:{String(sec).padStart(2, "0")}
    </span>
  );
}
