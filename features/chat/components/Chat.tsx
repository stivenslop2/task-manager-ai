'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useRef, useEffect, useState } from 'react'
import { ConfirmDialog } from '@/components/ui'

const SUGGESTED_PROMPTS = [
  'Show me my pending tasks',
  'What should I work on next?',
  'Create a task to refactor the auth module',
]

export default function Chat() {
  const [input, setInput] = useState('')
  const [confirmClearOpen, setConfirmClearOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const stickToBottom = useRef(true)

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    if (stickToBottom.current) {
      el.scrollTop = el.scrollHeight
    }
  }, [messages])

  function handleScroll() {
    const el = scrollRef.current
    if (!el) return
    const distance = el.scrollHeight - (el.scrollTop + el.clientHeight)
    stickToBottom.current = distance < 80
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    stickToBottom.current = true
    const text = input.trim()
    setInput('')
    sendMessage({ text })
  }

  function sendSuggestion(text: string) {
    if (isLoading) return
    stickToBottom.current = true
    sendMessage({ text })
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-9rem)] min-h-[420px] bg-white border border-border rounded-xl shadow-card overflow-hidden">
      <header className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
          <span className="text-sm font-medium text-ink">
            {messages.length > 0
              ? `${messages.length} ${messages.length === 1 ? 'message' : 'messages'}`
              : 'New conversation'}
          </span>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setConfirmClearOpen(true)}
            className="text-xs text-ink-muted hover:text-red-600 transition-colors"
            aria-label="Clear conversation"
          >
            Clear
          </button>
        )}
      </header>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-sm text-ink-muted">
              Ask me how to organize your tasks. I can search, read, create, and summarize.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {SUGGESTED_PROMPTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => sendSuggestion(s)}
                  className="rounded-full border border-border bg-surface-muted px-3 py-1 text-xs text-ink-muted hover:text-brand-600 hover:border-brand-200 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                message.role === 'user'
                  ? 'bg-brand-500 text-white rounded-br-sm'
                  : 'bg-surface-subtle text-ink border border-border rounded-bl-sm'
              }`}
            >
              {message.parts.map((part, i) => {
                if (part.type === 'text') {
                  return (
                    <p key={i} className="whitespace-pre-wrap leading-relaxed">
                      {part.text}
                    </p>
                  )
                }

                if (part.type.startsWith('tool-') && 'state' in part) {
                  const isRunning =
                    part.state === 'input-streaming' || part.state === 'input-available'
                  const toolName = part.type.replace('tool-', '')

                  return (
                    <details
                      key={i}
                      className="mt-2 text-xs bg-white border border-border rounded-lg px-3 py-2"
                    >
                      <summary className="cursor-pointer text-ink-muted list-none flex items-center gap-1.5 [&::-webkit-details-marker]:hidden">
                        {isRunning ? (
                          <>
                            <span className="inline-block animate-spin">⚙️</span>
                            <span>Running <code className="font-mono">{toolName}</code>…</span>
                          </>
                        ) : (
                          <>
                            <span>✅</span>
                            <span><code className="font-mono">{toolName}</code> completed</span>
                          </>
                        )}
                      </summary>
                      <pre className="mt-2 overflow-x-auto text-[11px] text-ink-muted whitespace-pre-wrap">
                        {'input' in part && part.input ? JSON.stringify(part.input, null, 2) : null}
                      </pre>
                    </details>
                  )
                }

                return null
              })}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-surface-subtle border border-border rounded-2xl rounded-bl-sm px-4 py-2.5">
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 bg-ink-soft rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-ink-soft rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-ink-soft rounded-full animate-bounce" />
              </span>
            </div>
          </div>
        )}
      </div>

      {messages.length > 10 && (
        <div className="px-4 py-2 bg-brand-50 border-t border-brand-200">
          <p className="text-xs text-brand-700">
            This conversation is getting long — consider starting a new one.
          </p>
        </div>
      )}

      <div className="border-t border-border p-3 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message…"
            disabled={isLoading}
            className="flex-1 border border-border rounded-lg px-3 py-2.5 text-sm placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Sending…' : 'Send'}
            <span aria-hidden>↑</span>
          </button>
        </form>
      </div>

      <ConfirmDialog
        open={confirmClearOpen}
        title="Clear this conversation?"
        description="All messages in this chat will be removed. This cannot be undone."
        confirmLabel="Clear"
        destructive
        onConfirm={() => setMessages([])}
        onClose={() => setConfirmClearOpen(false)}
      />
    </div>
  )
}
