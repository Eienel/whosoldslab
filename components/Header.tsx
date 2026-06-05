export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-ink/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="relative grid h-9 w-9 place-items-center rounded-lg border border-gold/40 bg-gradient-to-br from-gold/20 to-transparent">
            <span className="text-lg leading-none">🪪</span>
          </div>
          <div className="leading-tight">
            <div className="font-mono text-sm font-semibold tracking-[0.18em] text-foreground">
              WHO<span className="text-gold">SOLD</span>SLAB
            </div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-faint">
              diamond hands vs paper hands
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden items-center gap-2 rounded-full border border-hold/30 bg-hold/10 px-3 py-1 text-[11px] font-medium text-hold sm:flex">
            <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-hold" />
            LIVE · DRAW EVERY 30M
          </span>
          <a
            href="https://slabdrop.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-line-2 bg-card px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-gold/50 hover:text-foreground"
          >
            slabdrop.io ↗
          </a>
        </div>
      </div>
    </header>
  );
}
