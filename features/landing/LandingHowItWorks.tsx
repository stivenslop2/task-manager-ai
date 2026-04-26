interface Node {
  label: string
  detail: string
}

const nodes: Node[] = [
  {
    label: 'Next.js 16 App Router',
    detail:
      'Server Components by default; Server Actions for mutations; Route Handlers for streaming and JSON.',
  },
  {
    label: 'AI SDK + OpenAI',
    detail:
      'streamText for token streaming, generateText + Output.object for structured outputs, tool calls capped with stepCountIs.',
  },
  {
    label: 'Supabase + pgvector',
    detail:
      'Tasks live in Postgres; embeddings stored in a 1536-dim vector column and queried via cosine similarity for RAG.',
  },
  {
    label: 'Feature-sliced layout',
    detail:
      'features/tasks, features/ai, features/chat own their types, store, actions, and components. app/ stays focused on routing.',
  },
]

export function LandingHowItWorks() {
  return (
    <section className="mx-auto max-w-4xl px-6 pb-16">
      <h2 className="text-2xl font-semibold tracking-tight text-ink">
        How it works
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
        A short tour of the architecture. Read the{' '}
        <a
          href="https://github.com/stivenslop2/task-manager-ai#readme"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-brand-700 underline decoration-brand-300 underline-offset-2 hover:text-brand-800"
        >
          README
        </a>{' '}
        for the full breakdown.
      </p>

      <ol className="mt-8 space-y-3">
        {nodes.map((n, i) => (
          <li
            key={n.label}
            className="flex gap-4 rounded-xl border border-border bg-white p-4 shadow-card"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">{n.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                {n.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
