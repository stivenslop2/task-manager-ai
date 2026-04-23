import Link from 'next/link'
import Chat from '@/features/chat/components/Chat'

export default function ChatPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-border bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-brand-600 transition-colors"
          >
            <span aria-hidden>←</span> Home
          </Link>
          <h1 className="text-sm font-semibold tracking-tight text-ink">
            AI Productivity Assistant
          </h1>
          <Link
            href="/tasks"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-brand-600 transition-colors"
          >
            Tasks <span aria-hidden>→</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-ink">Chat with your tasks</h2>
          <p className="mt-1 text-sm text-ink-muted">
            A tool-calling agent that runs semantic search over your tasks, summarizes, and creates new ones. Capped at 5 steps per turn.
          </p>
        </div>
        <Chat />
      </main>
    </div>
  )
}
