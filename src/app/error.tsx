"use client";
import { useEffect } from "react";

/** Client error boundary. Kept provider-free so it renders even when the locale provider is what failed. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold tracking-tight">Terjadi kesalahan / Something went wrong</h1>
      <p className="text-muted-foreground">Coba muat ulang halaman ini. / Try reloading this page.</p>
      <button type="button" onClick={reset} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
        Coba lagi / Retry
      </button>
    </main>
  );
}
