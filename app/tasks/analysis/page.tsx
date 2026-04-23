import { analyzeTasks } from '@/features/ai/analysis'
import { Card } from '@/components/ui'

export default async function TaskAnalysisPage() {
  const analysis = await analyzeTasks()

  const scoreTone =
    analysis.productivityScore >= 70
      ? { ring: 'stroke-emerald-500', text: 'text-emerald-700', emoji: '🚀', label: 'On track' }
      : analysis.productivityScore >= 40
        ? { ring: 'stroke-brand-500', text: 'text-brand-700', emoji: '📈', label: 'Gaining momentum' }
        : { ring: 'stroke-red-500', text: 'text-red-700', emoji: '⚠️', label: 'Needs attention' }

  const score = Math.max(0, Math.min(100, analysis.productivityScore))
  const radius = 48
  const circumference = 2 * Math.PI * radius
  const dash = (score / 100) * circumference

  return (
    <div className="mx-auto max-w-3xl space-y-5">
        <div>
          <p className="text-[11px] font-semibold text-ink-soft uppercase tracking-wide">
            Structured output · generateText + Output.object
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-ink">
            Task Analysis ✨
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            A Zod-validated snapshot of your task list — computed on demand.
          </p>
        </div>

        <Card className="p-6">
          <div className="flex flex-wrap items-center gap-6">
            <div className="relative h-28 w-28 shrink-0">
              <svg viewBox="0 0 112 112" className="h-full w-full -rotate-90">
                <circle cx="56" cy="56" r={radius} className="stroke-surface-subtle fill-none" strokeWidth="10" />
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  strokeWidth="10"
                  strokeLinecap="round"
                  className={`fill-none ${scoreTone.ring} transition-[stroke-dasharray] duration-700`}
                  strokeDasharray={`${dash} ${circumference}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-ink">{score}</span>
                <span className="text-[10px] text-ink-soft uppercase tracking-wide">/100</span>
              </div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className={`inline-flex items-center gap-1.5 text-xs font-medium ${scoreTone.text}`}>
                <span aria-hidden>{scoreTone.emoji}</span>
                {scoreTone.label}
              </div>
              <p className="mt-1 text-sm font-semibold text-ink">Productivity Score</p>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                {analysis.summary}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-[11px] font-semibold text-ink-soft uppercase tracking-wide">
            Highest priority task
          </p>
          <p className="mt-2 text-base font-semibold text-ink">
            {analysis.priorityTask.title}
          </p>
          <p className="mt-1 text-sm text-ink-muted leading-relaxed">
            {analysis.priorityTask.reason}
          </p>
          <p className="mt-3 text-xs text-ink-soft">
            <span aria-hidden>⏱</span> Total estimate: {analysis.estimatedTotalHours}h
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-[11px] font-semibold text-ink-soft uppercase tracking-wide">
            Recommendations
          </p>
          <ul className="mt-3 space-y-3">
            {analysis.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3 text-sm">
                <span
                  className={`shrink-0 mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide ring-1 ${
                    rec.priority === 'high'
                      ? 'bg-red-50 text-red-700 ring-red-200'
                      : rec.priority === 'medium'
                        ? 'bg-brand-50 text-brand-700 ring-brand-200'
                        : 'bg-surface-subtle text-ink-muted ring-border'
                  }`}
                >
                  {rec.priority}
                </span>
                <span className="text-ink leading-relaxed">{rec.action}</span>
              </li>
            ))}
          </ul>
        </Card>
    </div>
  )
}
