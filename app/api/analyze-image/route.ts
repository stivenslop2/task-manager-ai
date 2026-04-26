import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(request: Request) {
  const formData = await request.formData()
  const image = formData.get('image') as File
  const question = formData.get('question') as string ?? '¿Qué ves en esta imagen?'

  if (!image) {
    return Response.json({ error: 'image is required' }, { status: 400 })
  }

  // Convertir File a base64
  const arrayBuffer = await image.arrayBuffer()
  const base64 = Buffer.from(arrayBuffer).toString('base64')
  const mediaType = image.type as 'application/pdf'

  const response = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: mediaType,  // el tipo MIME
              data: base64,
            }
          },
          {
            type: 'text',
            text: question
          }
        ]
      }
    ]
  })

  const text = response.content
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('')

  return Response.json({
    text,
    usage: response.usage,
    model: response.model,
  })
}