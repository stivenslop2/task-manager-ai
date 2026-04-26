export function LandingHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <span className="text-sm font-semibold tracking-tight text-ink">
          Task Manager <span className="text-brand-600">AI</span>
        </span>
        <a
          href="https://julianlopez.dev"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-brand-600"
        >
          <span aria-hidden>←</span>
          Portfolio
        </a>
      </div>
    </header>
  )
}
