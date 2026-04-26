import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

function selectModel(message: string, useTools: boolean = false): string {
  const wordCount = message.split(' ').length
  const complexKeywords = ['código', 'code', 'implementa', 'arquitectura', 'debug', 'error']
  const isComplex = complexKeywords.some(word => message.toLowerCase().includes(word))

  if (useTools || isComplex || wordCount > 50) {
    return 'claude-sonnet-4-5'
  }

  return 'claude-haiku-4-5'
}

function calculateCost(usage: Anthropic.Usage, model: string): number {
  const pricing: Record<string, { input: number; output: number }> = {
    'claude-haiku-4-5-20251001': { input: 0.80, output: 2.40 },
    'claude-sonnet-4-5-20251001': { input: 3.00, output: 15.00 },
  }

  const modelPricing = pricing[model] ?? pricing['claude-haiku-4-5-20251001']

  const inputCost = (usage.input_tokens / 1_000_000) * modelPricing.input
  const outputCost = (usage.output_tokens / 1_000_000) * modelPricing.output

  return inputCost + outputCost
}

export async function POST(request: Request) {
  const { message, useTools } = await request.json()

  const selectedModel = selectModel(message, useTools)

  let fullText = ''
  let totalUsage = { input_tokens: 0, output_tokens: 0 }
  let iterations = 0
  let finalStopReason = ''
  let finalModel = ''

  const messages: Anthropic.MessageParam[] = [
    { role: 'user', content: message }
  ]


  while (true) {
    iterations++

    const response = await client.messages.create({
      model: selectedModel,
      max_tokens: 1024,
      system: 'Eres un asistente de soporte técnico. Responde de forma concisa y precisa.',
      messages,
    })

    const chunk = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('')

    fullText += chunk
    finalStopReason = response.stop_reason ?? ''
    finalModel = response.model

    // Acumula el uso total de tokens
    totalUsage.input_tokens += response.usage.input_tokens
    totalUsage.output_tokens += response.usage.output_tokens

    console.log('Message: ', messages);
    
    console.log('Stop: ', response.stop_reason);
    
    if (response.stop_reason !== 'max_tokens') {
      break
    }

    // Agrega la respuesta parcial y pide continuación
    messages.push({ role: 'assistant', content: chunk })  // ✅ solo lo nuevo
    messages.push({ role: 'user', content: 'Continúa.' })
  }

  const totalCost = calculateCost(totalUsage as Anthropic.Usage, finalModel)

  return Response.json({
    text: fullText,
    model: finalModel,
    usage: totalUsage,
    cost_usd: totalCost,
    cost_formatted: `$${totalCost.toFixed(8)}`,
    iterations,           // cuántas veces llamó a la API
    stop_reason: finalStopReason,
  })
}