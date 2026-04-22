'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useRef, useEffect, useState } from 'react'

export default function Chat() {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    const text = input.trim()
    setInput('')
    sendMessage({ text })
  }

  return (
    <div className="flex flex-col h-[600px] bg-white border border-border rounded-2xl shadow-sm overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-sm font-medium text-ink">
          {messages.length > 0 ? `${messages.length} mensajes` : 'Nueva conversación'}
        </span>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="text-xs text-ink-muted hover:text-brand-600 transition-colors"
          >
            Nueva conversación
          </button>
        )}
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-ink-muted">
              Pregúntame cómo organizar tus tareas...
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                message.role === 'user'
                  ? 'bg-brand-500 text-white'
                  : 'bg-surface-muted text-ink border border-border'
              }`}
            >
              {/* En v6 el contenido está en message.parts */}
              {message.parts.map((part, i) =>
                part.type === 'text' ? (
                  <p key={i} className="whitespace-pre-wrap">{part.text}</p>
                ) : null
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-surface-muted border border-border rounded-2xl px-4 py-2">
              <span className="inline-flex gap-1">
                <span className="w-2 h-2 bg-ink-muted rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 bg-ink-muted rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 bg-ink-muted rounded-full animate-bounce" />
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Warning conversación larga */}
      {messages.length > 10 && (
        <div className="px-4 py-2 bg-brand-50 border-t border-brand-200">
          <p className="text-xs text-brand-700">
            La conversación es larga, considera empezar una nueva.
          </p>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            disabled={isLoading}
            className="flex-1 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </div>
    </div>
  )
}