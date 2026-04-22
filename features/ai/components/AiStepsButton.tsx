'use client'

import { useState } from 'react'
import { readTextDeltas } from '../stream'

interface Props {
  title: string
  description: string
}

export default function AiStepsButton({ title, description }: Props) {
  const [text, setText] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
        setText(prev => prev + delta)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setStreaming(false)
    }
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={generateSteps}
        disabled={streaming}
        className="inline-flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-brand-600 active:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        <SparkleIcon />
        {streaming ? 'Generating steps…' : 'Generate steps with AI'}
      </button>

      {error && (
        <p className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {text && (
        <div className="mt-4 p-4 bg-brand-50 border border-brand-200 rounded-xl">
          <h3 className="text-sm font-semibold text-brand-900 mb-2">
            AI-suggested steps
          </h3>
          <p className="text-sm text-ink whitespace-pre-wrap leading-relaxed">
            {text}
            {streaming && (
              <span className="ml-0.5 inline-block w-2 animate-pulse">▋</span>
            )}
          </p>
        </div>
      )}
    </div>
  )
}

function SparkleIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
    >
      <path d="M12 2l1.9 5.1L19 9l-5.1 1.9L12 16l-1.9-5.1L5 9l5.1-1.9L12 2zm7 12l.95 2.55L22.5 17.5l-2.55.95L19 21l-.95-2.55L15.5 17.5l2.55-.95L19 14z" />
    </svg>
  )
}
