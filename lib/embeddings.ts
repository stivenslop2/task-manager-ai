import { embed, embedMany } from 'ai'
import { openai } from '@ai-sdk/openai'

// El modelo text-embedding-3-small convierte texto en un vector de 1536 números.
// Es barato ($0.02 por millón de tokens) y suficientemente preciso para este caso.
const embeddingModel = openai.embedding('text-embedding-3-small')

// Convierte UN texto en vector
// Ejemplo: "Aprender React" → [0.2, -0.8, 0.1, ...]
export async function generateEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: embeddingModel,
    value: text,
  })
  return embedding
}

// Convierte VARIOS textos en vectores de una sola llamada a la API
// Más eficiente que llamar generateEmbedding() en un loop
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: texts,
  })
  return embeddings
}