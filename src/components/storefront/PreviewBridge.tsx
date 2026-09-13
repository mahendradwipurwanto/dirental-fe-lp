"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Msg =
  | { type: "rental:refresh" }
  | { type: "rental:highlight"; id: string | null }
  | { type: "rental:scroll"; id: string };

/**
 * Two-way bridge between the storefront preview and the builder that iframes it:
 * - parent → preview: refresh after a save, highlight/scroll to a block
 * - preview → parent: which block was clicked, and "ready" on mount
 * Only the admin origin is trusted.
 */
export function PreviewBridge() {
  const router = useRouter();
  useEffect(() => {
    const adminOrigin = process.env.NEXT_PUBLIC_ADMIN_ORIGIN;
    const post = (msg: unknown) => window.parent?.postMessage(msg, adminOrigin ?? "*");

    const onMessage = (e: MessageEvent<Msg>) => {
      if (adminOrigin && e.origin !== adminOrigin) return;
      const msg = e.data;
      if (!msg || typeof msg !== "object") return;
      if (msg.type === "rental:refresh") router.refresh();
      if (msg.type === "rental:highlight") {
        document.querySelectorAll<HTMLElement>("[data-block-selected]").forEach((el) => el.removeAttribute("data-block-selected"));
        if (msg.id) document.querySelector<HTMLElement>(`[data-block-id="${CSS.escape(msg.id)}"]`)?.setAttribute("data-block-selected", "true");
      }
      if (msg.type === "rental:scroll") document.querySelector<HTMLElement>(`[data-block-id="${CSS.escape(msg.id)}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-block-id]");
      if (!el) return;
      // Inner blocks (inside columns) win over their parent frame.
      e.preventDefault();
      post({ type: "rental:select", id: el.dataset.blockId });
    };
    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-block-id]");
      document.querySelectorAll<HTMLElement>("[data-block-hover]").forEach((x) => x.removeAttribute("data-block-hover"));
      el?.setAttribute("data-block-hover", "true");
    };

    window.addEventListener("message", onMessage);
    document.addEventListener("click", onClick, true);
    document.addEventListener("mouseover", onOver);
    post({ type: "rental:ready" });
    return () => {
      window.removeEventListener("message", onMessage);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("mouseover", onOver);
    };
  }, [router]);
  return null;
}
