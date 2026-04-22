'use client'

import { useState } from 'react'

interface Props {
  title: string
  description: string
}

export default function AIDescriptionButton({ title, description }: Props) {
  const [text, setText] = useState('')
  const [streaming, setStreaming] = useState(false)

  async function generateSteps() {
    setText('')
    setStreaming(true)

    const res = await fetch('/api/describe-task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    })

    const reader = res.body!.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      // Parsear el stream del AI SDK
      // El formato es: data: {"type":"text-delta","textDelta":"token"}
      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6))
            if (data.type === 'text-delta') {
              setText(prev => prev + data.textDelta)
            }
          } catch {
            // línea no parseable, ignorar
          }
        }
      }
    }

    setStreaming(false)
  }

  return (
    <div>
      <button
        onClick={generateSteps}
        disabled={streaming}
        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50 text-sm"
      >
        {streaming ? 'Generando pasos...' : '✨ Generar pasos con IA'}
      </button>

      {text && (
        <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h3 className="font-semibold text-purple-900 mb-2">
            Pasos sugeridos por IA:
          </h3>
          <p className="text-gray-700 whitespace-pre-wrap text-sm">
            {text}
            {streaming && (
              <span className="animate-pulse ml-1">|</span>
            )}
          </p>
        </div>
      )}
    </div>
  )
}