import { TaskAnalysis } from '@/app/api/analyze-tasks/route'

// Server Component que fetchea el análisis directamente
async function getAnalysis(): Promise<TaskAnalysis> {
  const res = await fetch('http://localhost:3000/api/analyze-tasks', {
    cache: 'no-store', // siempre fresco
  })
  return res.json()
}

export default async function TaskAnalysisPage() {
  const analysis = await getAnalysis()

  return (
    <main className="min-h-screen bg-surface-muted">
      <div className="mx-auto max-w-2xl px-6 py-10 space-y-6">

        <h1 className="text-2xl font-semibold text-ink">
          Análisis de Tareas ✨
        </h1>

        {/* Score */}
        <div className="bg-white border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ink-muted">Productivity Score</p>
              <p className="text-4xl font-bold text-ink mt-1">
                {analysis.productivityScore}
                <span className="text-lg text-ink-muted">/100</span>
              </p>
            </div>
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                analysis.productivityScore >= 70
                  ? 'bg-emerald-100'
                  : analysis.productivityScore >= 40
                  ? 'bg-brand-100'
                  : 'bg-red-100'
              }`}
            >
              {analysis.productivityScore >= 70 ? '🚀' : analysis.productivityScore >= 40 ? '📈' : '⚠️'}
            </div>
          </div>
          <p className="mt-4 text-sm text-ink-muted leading-relaxed">
            {analysis.summary}
          </p>
        </div>

        {/* Tarea prioritaria */}
        <div className="bg-white border border-border rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-ink-muted uppercase tracking-wide mb-3">
            Tarea más prioritaria
          </h2>
          <p className="font-semibold text-ink">{analysis.priorityTask.title}</p>
          <p className="text-sm text-ink-muted mt-1">{analysis.priorityTask.reason}</p>
          <p className="text-xs text-ink-muted mt-3">
            ⏱ Estimación total: {analysis.estimatedTotalHours}h
          </p>
        </div>

        {/* Recomendaciones */}
        <div className="bg-white border border-border rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-ink-muted uppercase tracking-wide mb-4">
            Recomendaciones
          </h2>
          <ul className="space-y-3">
            {analysis.recommendations.map((rec, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-sm"
              >
                <span
                  className={`shrink-0 mt-0.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                    rec.priority === 'high'
                      ? 'bg-red-100 text-red-700'
                      : rec.priority === 'medium'
                      ? 'bg-brand-100 text-brand-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {rec.priority}
                </span>
                <span className="text-ink">{rec.action}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </main>
  )
}