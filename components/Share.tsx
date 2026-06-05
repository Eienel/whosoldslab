"use client";

import { useState } from "react";

export function Share({ tweet }: { tweet: string }) {
  const [copied, setCopied] = useState(false);

  const onShare = () => {
    const url = typeof window !== "undefined" ? window.location.origin : "";
    const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweet,
    )}&url=${encodeURIComponent(url)}`;
    window.open(intent, "_blank", "noopener,noreferrer");
  };

  const onCopy = async () => {
    const url = typeof window !== "undefined" ? window.location.origin : "";
    try {
      await navigator.clipboard.writeText(`${tweet}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={onShare}
        className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 font-mono text-sm font-semibold text-ink transition-opacity hover:opacity-90"
      >
        <span>𝕏</span> Share on X
      </button>
      <button
        onClick={onCopy}
        className="inline-flex items-center gap-2 rounded-md border border-line-2 bg-surface px-4 py-2 font-mono text-sm text-muted transition-colors hover:border-pink/50 hover:text-foreground"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
