import Chat from '@/features/chat/components/Chat'

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-surface-muted">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-2xl font-semibold text-ink mb-6">
          AI Productivity Assistant
        </h1>
        <Chat />
      </div>
    </main>
  )
}