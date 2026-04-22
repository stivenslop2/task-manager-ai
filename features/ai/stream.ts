// Parses the `data: {...}` SSE lines produced by the AI SDK's
// toUIMessageStreamResponse() and yields text-delta tokens.
export async function* readTextDeltas(
  body: ReadableStream<Uint8Array>,
): AsyncGenerator<string> {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })

    let newlineIndex: number
    while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, newlineIndex).trim()
      buffer = buffer.slice(newlineIndex + 1)

      if (!line.startsWith('data: ')) continue

      try {
        const payload = JSON.parse(line.slice(6))
        if (payload.type === 'text-delta' && typeof payload.textDelta === 'string') {
          yield payload.textDelta
        }
      } catch {
        // Ignore unparseable lines — keep consuming the stream.
      }
    }
  }
}
