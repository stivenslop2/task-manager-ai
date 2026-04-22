import { convertToModelMessages, streamText, UIMessage } from 'ai'
import { openai } from '@ai-sdk/openai'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: `Eres un asistente de productividad experto.
Ayudas a los usuarios a organizar sus tareas, planificar su trabajo
y ser más productivos. Responde de forma concisa y práctica.`,
    messages: await convertToModelMessages(messages), // ← este es el cambio clave
  })

  return result.toUIMessageStreamResponse()
}