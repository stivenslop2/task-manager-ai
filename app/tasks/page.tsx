import Link from 'next/link'
import { Suspense } from 'react'
import TaskForm from '@/features/tasks/components/TaskForm'
import TaskList from '@/features/tasks/components/TaskList'
import TasksSkeleton from '@/features/tasks/components/TasksSkeleton'

export default function TasksPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">Your tasks</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Create a task and open it to stream AI-generated steps, or ask the chat agent.
          </p>
        </div>
        <Link
          href="/tasks/analysis"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-ink-muted hover:text-brand-600 hover:border-brand-200 transition-colors"
        >
          ✨ AI Task Analysis
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-20 lg:self-start">
          <TaskForm />
        </div>
        <Suspense fallback={<TasksSkeleton />}>
          <TaskList />
        </Suspense>
      </div>
    </div>
  )
}
