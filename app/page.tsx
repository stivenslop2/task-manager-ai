import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-2xl px-6 py-24">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 ring-1 ring-brand-200">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          Sprint 0 · Next.js 16
        </span>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Task Manager with <span className="text-brand-600">AI</span>
        </h1>

        <p className="mt-4 text-base leading-relaxed text-ink-muted">
          Create and organize tasks, then let AI stream concrete steps to help
          you finish them. Built with the App Router, Server Components, Server
          Actions, Route Handlers, and the Vercel AI SDK.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">

          <Link
            href="/tasks"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-600 active:bg-brand-700"
          >
            Open task manager
            <span aria-hidden>→</span>
          </Link>
          <a
            href="https://github.com/stivenslop2/task-manager-ai"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-ink hover:border-brand-300 hover:text-brand-600 transition-colors"
          >
            View on GitHub
          </a>
          <Link href="/chat" className="inline-flex items-center gap-2 ...">
            → AI Chat Assistant
          </Link>
          <Link href="/tasks/analysis">
            → Análisis IA de tareas
          </Link>
        </div>
      </section>
    </main>
  )
}
