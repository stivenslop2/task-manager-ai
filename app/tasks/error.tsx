'use client'

import { Button } from '@/components/ui'

export default function TasksError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <p className="text-sm font-medium text-red-800">
        Something went wrong loading your tasks.
      </p>
      <p className="mt-1 text-xs text-red-700">
        {error.message || 'Unknown error'}
      </p>
      <div className="mt-4 flex justify-center">
        <Button variant="primary" size="sm" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  )
}
