import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTaskById } from '@/features/tasks/store'
import TaskStatusBadge from '@/features/tasks/components/TaskStatusBadge'
import AiStepsButton from '@/features/ai/components/AiStepsButton'

interface Props {
  params: Promise<{ id: string }>
}

export default async function TaskDetailPage({ params }: Props) {
  const { id } = await params
  const task = await getTaskById(Number(id))

  if (!task) notFound()

  return (
    <div className="space-y-6">
      <Link
        href="/tasks"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-brand-600 transition-colors"
      >
        ← Back to tasks
      </Link>

      <article className="bg-white border border-border rounded-2xl p-6 shadow-sm">
        <header className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            {task.title}
          </h1>
          <TaskStatusBadge completed={task.completed} />
        </header>

        {task.description ? (
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            {task.description}
          </p>
        ) : (
          <p className="mt-4 text-sm italic text-ink-muted">
            No description provided.
          </p>
        )}

        <div className="mt-6 border-t border-border pt-6">
          <AiStepsButton title={task.title} description={task.description} />
        </div>
      </article>
    </div>
  )
}
