import Link from 'next/link'

const techniques = [
  'Streaming text',
  'Tool calling',
  'Structured outputs',
  'RAG with pgvector',
]

export function LandingHero() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
      <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 ring-1 ring-brand-200">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
        AI Engineer Portfolio · Next.js 16
      </span>

      <h1 className="mt-6 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
        Task Manager <span className="text-brand-600">AI</span>
      </h1>

      <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
        A production-style task manager that showcases the patterns I reach
        for when building LLM features — streaming, tool-calling agents,
        structured outputs, and retrieval-augmented search over user data.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {techniques.map((t) => (
          <span
            key={t}
            className="inline-flex items-center rounded-full bg-white border border-border px-3 py-1 text-xs font-medium text-ink-muted"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          href="/tasks"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-card transition-all hover:bg-brand-700 hover:shadow-card-hover"
        >
          Open the app
          <span aria-hidden>→</span>
        </Link>
        <a
          href="https://github.com/stivenslop2/task-manager-ai"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand-200 hover:text-brand-700"
        >
          View source
        </a>
      </div>
    </section>
  )
}
