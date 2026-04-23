'use client'

import { useState } from 'react'
import { readTextDeltas } from '../stream'
import { Button, useToast } from '@/components/ui'

interface Props {
  title: string
  description: string
}

export default function AiStepsButton({ title, description }: Props) {
  const [text, setText] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const toast = useToast()

  async function generateSteps() {
    setText('')
    setError(null)
    setStreaming(true)

    try {
      const res = await fetch('/api/describe-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      })

      if (!res.ok || !res.body) {
        throw new Error(`Request failed with status ${res.status}`)
      }

      for await (const delta of readTextDeltas(res.body)) {
        setText((prev) => prev + delta)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setStreaming(false)
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(text)
    toast.show('Steps copied to clipboard', 'success')
  }

  const hasOutput = text.length > 0

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={generateSteps} disabled={streaming} leftIcon={<SparkleIcon />}>
          {streaming ? 'Generating…' : hasOutput ? 'Regenerate' : 'Generate steps'}
        </Button>
        {hasOutput && !streaming && (
          <Button type="button" variant="secondary" onClick={copy}>
            Copy
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">
          <p className="text-sm text-red-800">{error}</p>
          <button
            type="button"
            onClick={generateSteps}
            className="mt-1 text-xs font-medium text-red-700 underline hover:text-red-900"
          >
            Retry
          </button>
        </div>
      )}

      {hasOutput && (
        <div className="rounded-xl border border-brand-200 bg-brand-50/60 p-4 animate-fade-in">
          <p className="text-sm text-ink whitespace-pre-wrap leading-relaxed">
            {text}
            {streaming && (
              <span className="ml-0.5 inline-block w-2 animate-pulse">▋</span>
            )}
          </p>
        </div>
      )}

      {streaming && !hasOutput && (
        <div className="rounded-xl border border-border bg-white p-4 overflow-hidden">
          <div className="h-3 w-2/3 rounded bg-surface-subtle animate-shimmer" />
          <div className="mt-2 h-3 w-4/5 rounded bg-surface-subtle animate-shimmer" />
          <div className="mt-2 h-3 w-1/2 rounded bg-surface-subtle animate-shimmer" />
        </div>
      )}
    </div>
  )
}

function SparkleIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 2l1.9 5.1L19 9l-5.1 1.9L12 16l-1.9-5.1L5 9l5.1-1.9L12 2zm7 12l.95 2.55L22.5 17.5l-2.55.95L19 21l-.95-2.55L15.5 17.5l2.55-.95L19 14z" />
    </svg>
  )
}
