import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { buildStepsPrompt } from '@/features/ai/prompts'

interface RequestBody {
  title?: string
  description?: string | null
}

export async function POST(request: Request) {
  const { title, description } = (await request.json()) as RequestBody

  if (!title || typeof title !== 'string') {
    return Response.json({ error: 'title is required' }, { status: 400 })
  }

  const result = streamText({
    model: openai('gpt-4o-mini'),
    prompt: buildStepsPrompt({ title, description }),
  })

  return result.toUIMessageStreamResponse()
}
