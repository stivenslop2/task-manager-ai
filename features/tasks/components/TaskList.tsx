import { getTasks } from '../store'
import TaskItem from './TaskItem'
import { EmptyState } from '@/components/ui'

export default async function TaskList() {
  const tasks = await getTasks()

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon="🗂"
        title="No tasks yet"
        description="Create your first task to see it here. Each task is classified by AI on creation."
      />
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-semibold text-ink-soft uppercase tracking-wide">
        {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
      </p>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>
    </div>
  )
}
