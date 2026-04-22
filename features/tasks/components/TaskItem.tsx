import Link from 'next/link'
import type { Task } from '../types'
import DeleteTaskButton from './DeleteTaskButton'
import TaskStatusBadge from './TaskStatusBadge'

interface Props {
  task: Task
}

export default function TaskItem({ task }: Props) {
  return (
    <li className="group bg-white border border-border rounded-2xl p-4 shadow-sm hover:border-brand-300 hover:shadow-md transition flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <Link
          href={`/tasks/${task.id}`}
          className="font-medium text-ink hover:text-brand-600 transition-colors"
        >
          {task.title}
        </Link>

        {task.description && (
          <p className="mt-1 text-sm text-ink-muted line-clamp-2">
            {task.description}
          </p>
        )}

        <TaskStatusBadge completed={task.completed} className="mt-3" />
      </div>

      <DeleteTaskButton id={task.id} />
    </li>
  )
}
