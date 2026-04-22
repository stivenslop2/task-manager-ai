import { Suspense } from 'react'
import TaskForm from '@/features/tasks/components/TaskForm'
import TaskList from '@/features/tasks/components/TaskList'
import TasksSkeleton from '@/features/tasks/components/TasksSkeleton'

export default function TasksPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">Your tasks</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Create tasks and open one to stream AI-generated steps.
        </p>
      </div>

      <TaskForm />

      <Suspense fallback={<TasksSkeleton />}>
        <TaskList />
      </Suspense>
    </div>
  )
}
