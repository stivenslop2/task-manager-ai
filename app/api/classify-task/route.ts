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
    prompt: `Classify this task:
Title: ${title}
Description: ${description || 'No description'}

Available categories: work, learning, personal, health
Difficulty levels: easy, medium, hard
Suggested deadline: today, this-week, this-month, someday
Generate up to 3 relevant tags and estimate the minutes required.`,
  })

  return Response.json(output)
}