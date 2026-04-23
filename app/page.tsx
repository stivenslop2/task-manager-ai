import Link from 'next/link'

interface Feature {
  href: string
  title: string
  description: string
  icon: string
  accent: 'brand' | 'emerald' | 'purple' | 'ink'
  external?: boolean
}

const features: Feature[] = [
  {
    href: '/tasks',
    title: 'Tasks',
    description: 'Create, browse, and delete tasks. Each one is auto-classified with structured outputs.',
    icon: '🗂',
    accent: 'brand',
  },
  {
    href: '/chat',
    title: 'AI Chat Assistant',
    description: 'Tool-calling agent that searches, reads, and creates tasks on your behalf.',
    icon: '💬',
    accent: 'emerald',
  },
  {
    href: '/tasks/analysis',
    title: 'AI Task Analysis',
    description: 'Structured analysis over your tasks: priority, estimates, and recommendations.',
    icon: '📊',
    accent: 'purple',
  },
  {
    href: 'https://github.com/stivenslop2/task-manager-ai',
    title: 'Source on GitHub',
    description: 'Read the code, schema, and architecture decisions behind each AI feature.',
    icon: '</>',
    accent: 'ink',
    external: true,
  },
]

const techniques = [
  'Streaming text',
  'Tool calling',
  'Structured outputs',
  'RAG with pgvector',
]

const accentClasses: Record<string, string> = {
  brand: 'bg-brand-50 text-brand-700 ring-brand-200',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  purple: 'bg-purple-50 text-purple-700 ring-purple-200',
  ink: 'bg-surface-subtle text-ink ring-border',
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
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

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {features.map((f) => {
            const card = (
              <div className="group h-full rounded-xl border border-border bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover hover:border-brand-200">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ring-1 text-base ${accentClasses[f.accent]}`}
                  >
                    {f.icon}
                  </span>
                  <h2 className="text-sm font-semibold text-ink">{f.title}</h2>
                  <span
                    aria-hidden
                    className="ml-auto text-ink-soft transition-colors group-hover:text-brand-500"
                  >
                    →
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {f.description}
                </p>
              </div>
            )
            return f.external ? (
              <a
                key={f.href}
                href={f.href}
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                {card}
              </a>
            ) : (
              <Link key={f.href} href={f.href} className="block">
                {card}
              </Link>
            )
          })}
        </div>
      </section>
    </main>
  )
}
