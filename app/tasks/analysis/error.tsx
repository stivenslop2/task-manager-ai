'use client'

import Link from 'next/link'
import { Button } from '@/components/ui'

export default function AnalysisError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="mx-auto max-w-md px-6 py-16 text-center">
      <p className="text-base font-semibold text-ink">Analysis failed</p>
      <p className="mt-1 text-sm text-ink-muted">
        {error.message || 'The analysis call did not complete. Try again, or check that OPENAI_API_KEY is set.'}
      </p>
      <div className="mt-5 flex justify-center gap-2">
        <Button variant="primary" size="sm" onClick={reset}>
          Try again
        </Button>
        <Link
          href="/tasks"
          className="inline-flex items-center rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-ink-muted hover:text-brand-600 transition-colors"
        >
          Back to tasks
        </Link>
      </div>
    </div>
  )
}
