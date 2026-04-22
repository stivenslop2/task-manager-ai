import { convertToModelMessages, streamText, UIMessage, tool, stepCountIs } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import { getTasks, getTaskById, createTask } from '@/features/tasks/store'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: `Eres un asistente de productividad experto.
Tienes acceso a las tareas del usuario y puedes consultarlas o crear nuevas.
Cuando el usuario pregunte por sus tareas, usa las tools disponibles.
Responde siempre en el mismo idioma que el usuario.`,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(5), // ← reemplaza maxSteps
    tools: {
      getTasks: {
        description: 'Obtiene la lista de todas las tareas del usuario',
        inputSchema: z.object({}),
        execute: async () => await getTasks(),
      },
      getTaskById: {
        description: 'Obtiene el detalle de una tarea específica por su ID',
        inputSchema: z.object({
          id: z.number().describe('El ID numérico de la tarea'),
        }),
        execute: async ({ id }: { id: number }) => {
          const task = await getTaskById(id)
          if (!task) return { error: `No se encontró la tarea con ID ${id}` }
          return task
        },
      },
      createTask: {
        description: 'Crea una nueva tarea para el usuario',
        inputSchema: z.object({
          title: z.string().describe('El título de la tarea'),
          description: z.string().describe('La descripción detallada'),
        }),
        execute: async ({ title, description }: { title: string; description: string }) => {
          const task = await createTask(title, description)
          return { success: true, task }
        },
      },
      getTasksSummary: {
        description: 'Resumen estadístico: total, completadas y pendientes',
        inputSchema: z.object({}),
        execute: async () => {
          const tasks = await getTasks()
          return {
            total: tasks.length,
            completed: tasks.filter(t => t.completed).length,
            pending: tasks.filter(t => !t.completed).length,
          }
        },
      },
    },
  })

  return result.toUIMessageStreamResponse()
}