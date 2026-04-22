import { getTaskById } from '@/lib/tasks'
import { notFound } from 'next/navigation'
import AIDescriptionButton from './AIDescriptionButton'
import Link from 'next/link'

interface Props {
  params: Promise<{ id: string }>
}

export default async function TaskDetailPage({ params }: Props) {
  const { id } = await params
  const task = await getTaskById(Number(id))

  if (!task) notFound()

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <Link
        href="/tasks"
        className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block"
      >
        ← Volver a tareas
      </Link>

      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-2xl font-bold">{task.title}</h1>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              task.completed
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {task.completed ? 'Completada' : 'Pendiente'}
          </span>
        </div>

        {task.description && (
          <p className="text-gray-600 mb-6">{task.description}</p>
        )}

        {/* Botón que activa el streaming de IA */}
        <AIDescriptionButton
          title={task.title}
          description={task.description}
        />
      </div>
    </main>
  )
}