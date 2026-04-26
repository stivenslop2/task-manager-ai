import Link from 'next/link'

export function LandingTryIt() {
  return (
    <section className="mx-auto max-w-4xl px-6 pb-16">
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-8 sm:p-10">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          Try it
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
          Jump straight into the task list — create a task and watch it get
          classified, then ask the chat agent about it.
        </p>
        <div className="mt-6">
          <Link
            href="/tasks"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-card transition-all hover:bg-brand-700 hover:shadow-card-hover"
          >
            Open /tasks
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
