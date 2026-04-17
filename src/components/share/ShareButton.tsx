"use client";

import { useState } from "react";

export function ShareButton({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // User cancelled or share failed, fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-surface-card px-3 py-1.5 text-xs font-medium text-on-surface-muted transition-all hover:border-white/[0.2] hover:text-on-surface"
    >
      {status === "copied"
        ? "Đã sao chép!"
        : status === "error"
        ? "Không thể sao chép"
        : "Chia sẻ"}
    </button>
  );
}
