import Link from 'next/link'

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-surface-muted">
      <header className="border-b border-border bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-sm font-medium text-ink-muted hover:text-brand-600 transition-colors">
            ← Home
          </Link>
          <h1 className="text-sm font-semibold tracking-tight text-ink">
            Task Manager
          </h1>
          <span className="w-12" aria-hidden />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10">{children}</main>
    </div>
  )
}
