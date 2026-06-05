export function truncateWallet(addr: string, lead = 4, tail = 4): string {
  if (!addr || addr.length <= lead + tail + 1) return addr;
  return `${addr.slice(0, lead)}..${addr.slice(-tail)}`;
}

export function usd(n: number, opts: { compact?: boolean } = {}): string {
  const digits = n < 100 && n % 1 !== 0 ? 2 : 0;
  if (opts.compact && Math.abs(n) >= 10000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(n);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: digits,
  }).format(n);
}

export function pct(n: number, digits = 0): string {
  return `${(n * 100).toFixed(digits)}%`;
}

// odds come in as a fraction (e.g. 0.0037). Show as 1-in-N for readability.
export function oddsLabel(odds?: number): string {
  if (!odds || odds <= 0) return "n/a";
  if (odds >= 1) return "100%";
  return `1 in ${Math.round(1 / odds).toLocaleString("en-US")}`;
}

export function relativeTime(iso: string, now: number = Date.now()): string {
  const diff = now - new Date(iso).getTime();
  if (Number.isNaN(diff)) return "";
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  return `${months}mo ago`;
}
