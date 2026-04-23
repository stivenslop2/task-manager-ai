import Link from 'next/link'

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-border bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-brand-600 transition-colors"
          >
            <span aria-hidden>←</span> Home
          </Link>
          <h1 className="text-sm font-semibold tracking-tight text-ink">
            Task Manager AI
          </h1>
          <Link
            href="/chat"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-brand-600 transition-colors"
          >
            Chat <span aria-hidden>→</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  )
}
