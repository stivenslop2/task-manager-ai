import { getTasks } from '../store'
import TaskItem from './TaskItem'

export default async function TaskList() {
  const tasks = await getTasks()

  if (tasks.length === 0) {
    return (
      <div className="border border-dashed border-border rounded-2xl py-12 text-center">
        <p className="text-sm text-ink-muted">
          No tasks yet. Create your first one above.
        </p>
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  )
}
