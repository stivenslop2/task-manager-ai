import Link from 'next/link'

interface Feature {
  href: string
  title: string
  description: string
  icon: string
  accent: 'brand' | 'emerald' | 'amber'
}

const features: Feature[] = [
  {
    href: '/tasks',
    title: 'Tasks',
    description:
      'Create, browse, and delete tasks. Each one is auto-classified with structured outputs.',
    icon: '🗂',
    accent: 'brand',
  },
  {
    href: '/chat',
    title: 'AI Chat Assistant',
    description:
      'Tool-calling agent that searches, reads, and creates tasks on your behalf.',
    icon: '💬',
    accent: 'emerald',
  },
  {
    href: '/tasks/analysis',
    title: 'AI Task Analysis',
    description:
      'Structured analysis over your tasks: priority, estimates, and recommendations.',
    icon: '📊',
    accent: 'amber',
  },
]

const accentClasses: Record<Feature['accent'], string> = {
  brand: 'bg-brand-50 text-brand-700 ring-brand-200',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200',
}

export function LandingSkills() {
  return (
    <section className="mx-auto max-w-4xl px-6 pb-16">
      <h2 className="text-2xl font-semibold tracking-tight text-ink">
        What this demonstrates
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
        Three AI surfaces, each implemented with a different production pattern.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {features.map((f) => (
          <Link key={f.href} href={f.href} className="block">
            <div className="group h-full rounded-xl border border-border bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover hover:border-brand-200">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ring-1 text-base ${accentClasses[f.accent]}`}
                >
                  {f.icon}
                </span>
                <h3 className="text-sm font-semibold text-ink">{f.title}</h3>
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
          </Link>
        ))}
      </div>
    </section>
  )
}
