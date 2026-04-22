import Link from 'next/link'
import { getTasks } from '@/lib/tasks'
import DeleteTaskButton from './DeleteTaskButton'

export default async function TaskList() {
  const tasks = await getTasks()

  if (tasks.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        No hay tareas. Crea la primera.
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="bg-white border rounded-lg p-4 flex items-start justify-between gap-4"
        >
          <div className="flex-1">
            <Link
              href={`/tasks/${task.id}`}
              className="font-medium text-gray-900 hover:text-blue-600"
            >
              {task.title}
            </Link>
            {task.description && (
              <p className="text-sm text-gray-500 mt-1">
                {task.description}
              </p>
            )}
            <span
              className={`text-xs mt-2 inline-block px-2 py-0.5 rounded-full ${
                task.completed
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {task.completed ? 'Completada' : 'Pendiente'}
            </span>
          </div>

          <DeleteTaskButton id={task.id} />
        </li>
      ))}
    </ul>
  )
}