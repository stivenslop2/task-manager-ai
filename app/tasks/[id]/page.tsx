import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTaskById } from '@/features/tasks/store'
import TaskStatusBadge from '@/features/tasks/components/TaskStatusBadge'
import AiStepsButton from '@/features/ai/components/AiStepsButton'
import { Card } from '@/components/ui'

interface Props {
  params: Promise<{ id: string }>
}

export default async function TaskDetailPage({ params }: Props) {
  const { id } = await params
  const task = await getTaskById(Number(id))

  if (!task) notFound()

  const hasDescription = Boolean(task.description?.trim())
  const createdAt = new Date(task.createdAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <div className="space-y-6">
      <Link
        href="/tasks"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-brand-600 transition-colors"
      >
        <span aria-hidden>←</span> Back to tasks
      </Link>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <Card className="p-6 h-fit">
          <p className="text-[11px] font-semibold text-ink-soft uppercase tracking-wide">
            Task #{task.id}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
            {task.title}
          </h1>
          <div className="mt-3 flex items-center gap-2 text-xs text-ink-muted">
            <TaskStatusBadge completed={task.completed} />
            <span aria-hidden>·</span>
            <span>Created {createdAt}</span>
          </div>

          <div className="mt-5 border-t border-border pt-5">
            <p className="text-[11px] font-semibold text-ink-soft uppercase tracking-wide">
              Description
            </p>
            {hasDescription ? (
              <p className="mt-2 text-sm leading-relaxed text-ink whitespace-pre-wrap">
                {task.description}
              </p>
            ) : (
              <p className="mt-2 text-sm italic text-ink-soft">
                No description provided.
              </p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <span className="text-lg" aria-hidden>✨</span>
            <h2 className="text-base font-semibold text-ink">AI-generated steps</h2>
          </div>
          <p className="mt-1 text-xs text-ink-muted">
            Streams a concrete plan token-by-token from <code className="font-mono text-ink">gpt-4o-mini</code> via <code className="font-mono text-ink">streamText</code>.
          </p>
          <div className="mt-4">
            <AiStepsButton title={task.title} description={task.description} />
          </div>
        </Card>
      </div>
    </div>
  )
}
