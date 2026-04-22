import { generateText, Output } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

interface RequestBody {
  title?: string
  description?: string | null
}

const TaskClassificationSchema = z.object({
  category: z.enum(['work', 'learning', 'personal', 'health']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  estimatedMinutes: z.number(),
  tags: z.array(z.string()).max(3),
  suggestedDeadline: z.enum(['today', 'this-week', 'this-month', 'someday']),
})

export type TaskClassification = z.infer<typeof TaskClassificationSchema>

export async function POST(request: Request) {
  const { title, description } = (await request.json()) as RequestBody

  if (!title) {
    return Response.json({ error: 'title is required' }, { status: 400 })
  }

  const { output } = await generateText({
    model: openai('gpt-4o-mini'),
    output: Output.object({
      schema: TaskClassificationSchema,
    }),
    prompt: `Clasifica esta tarea:
Título: ${title}
Descripción: ${description || 'Sin descripción'}

Categorías disponibles: work, learning, personal, health
Dificultades: easy, medium, hard
Deadline sugerido: today, this-week, this-month, someday
Genera máximo 3 tags relevantes y estima los minutos necesarios.`,
  })

  return Response.json(output)
}