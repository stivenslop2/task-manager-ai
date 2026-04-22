import { generateText, Output } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import { getTasks } from '@/features/tasks/store'

// Schema Zod — define la forma exacta del output
const TaskAnalysisSchema = z.object({
  summary: z.string().describe('Resumen general del estado de las tareas'),
  priorityTask: z.object({
    id: z.number().describe('ID de la tarea más prioritaria'),
    title: z.string(),
    reason: z.string().describe('Por qué es la más prioritaria'),
  }),
  estimatedTotalHours: z.number().describe('Estimación total de horas para completar todo'),
  recommendations: z.array(
    z.object({
      taskId: z.number(),
      action: z.string().describe('Qué hacer con esta tarea'),
      priority: z.enum(['high', 'medium', 'low']),
    })
  ),
  productivityScore: z.number().min(0).max(100).describe('Score del 0 al 100 basado en tareas completadas'),
})

export type TaskAnalysis = z.infer<typeof TaskAnalysisSchema>

export async function GET() {
  const tasks = await getTasks()

  const { output } = await generateText({
    model: openai('gpt-4o-mini'),
    output: Output.object({
      schema: TaskAnalysisSchema,
    }),
    prompt: `Analiza estas tareas y devuelve un análisis estructurado:
${JSON.stringify(tasks, null, 2)}

Analiza el estado actual, identifica la tarea más prioritaria,
estima horas de trabajo y da recomendaciones concretas.`,
  })

  return Response.json(output)
}