import Link from 'next/link'
import type { Task } from '../types'
import DeleteTaskButton from './DeleteTaskButton'
import TaskStatusBadge from './TaskStatusBadge'

interface Props {
  task: Task
}

export default function TaskItem({ task }: Props) {
  return (
    <li className="group bg-white border border-border rounded-xl shadow-card transition-all hover:border-brand-200 hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-3 p-4">
        <Link
          href={`/tasks/${task.id}`}
          className="flex-1 min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-brand-400 rounded-md"
        >
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-ink truncate group-hover:text-brand-600 transition-colors">
              {task.title}
            </h3>
            <TaskStatusBadge completed={task.completed} />
          </div>
          {task.description && (
            <p className="mt-1 text-sm text-ink-muted line-clamp-2">
              {task.description}
            </p>
          )}
        </Link>

        <DeleteTaskButton id={task.id} title={task.title} />
      </div>
    </li>
  )
}
