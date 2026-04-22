import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(request: Request) {
  const { title, description } = await request.json()

  const result = streamText({
    model: openai('gpt-4o-mini'),
    prompt: `Eres un asistente de productividad. 
    Dado el título de una tarea: "${title}"
    Y su descripción: "${description || 'Sin descripción'}"
    
    Genera 3 pasos concretos y accionables para completar esta tarea.
    Sé conciso y directo. Máximo 2 oraciones por paso.`,
  })

  return result.toUIMessageStreamResponse()
}