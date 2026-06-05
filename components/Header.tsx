export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-ink/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-md border border-pink/40 bg-pink/10 text-base">
            🪪
          </div>
          <div className="font-mono text-sm font-bold tracking-[0.16em] text-foreground">
            WHO<span className="text-pink">SOLD</span>SLAB
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 rounded border border-line-2 bg-surface px-2.5 py-1 font-mono text-[11px] text-hold sm:flex">
            <span className="blink inline-block h-1.5 w-1.5 rounded-full bg-hold" />
            LIVE
          </span>
          <a
            href="https://slabdrop.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-line-2 bg-surface px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-pink/50 hover:text-foreground"
          >
            slabdrop.io
          </a>
        </div>
      </div>
    </header>
  );
}
