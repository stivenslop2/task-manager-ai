import { supabase } from '@/lib/supabase'
import { generateEmbedding } from '@/lib/embeddings'
import type { Task } from './types'

function rowToTask(row: Record<string, unknown>): Task {
  return {
    id: row.id as number,
    title: row.title as string,
    description: row.description as string,
    completed: row.completed as boolean,
    createdAt: new Date(row.created_at as string),
  }
}

export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tm_tasks')
    .select('id, title, description, completed, created_at')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []).map(rowToTask)
}

export async function getTaskById(id: number): Promise<Task | null> {
  const { data, error } = await supabase
    .from('tm_tasks')
    .select('id, title, description, completed, created_at')
    .eq('id', id)
    .single()

  if (error) return null
  return rowToTask(data)
}

export async function createTask(
  title: string,
  description: string,
): Promise<Task> {
  // Embed title + description together so semantic search has richer context than title alone.
  const embedding = await generateEmbedding(`${title} ${description}`)

  const { data, error } = await supabase
    .from('tm_tasks')
    .insert({
      title,
      description,
      // 1536-dim vector from OpenAI text-embedding-3-small; must match the vector(1536) column.
      embedding,
    })
    .select('id, title, description, completed, created_at')
    .single()

  if (error) throw new Error(error.message)
  return rowToTask(data)
}

export async function deleteTask(id: number): Promise<void> {
  const { error } = await supabase
    .from('tm_tasks')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export async function searchSimilarTasks(
  query: string,
  limit: number = 5,
): Promise<Task[]> {
  const queryEmbedding = await generateEmbedding(query)

  const { data, error } = await supabase.rpc('match_tm_tasks', {
    query_embedding: queryEmbedding,
    // 0.3 cosine similarity floor — empirically filters out unrelated tasks while keeping loose matches.
    match_threshold: 0.3,
    match_count: limit,
  })

  if (error) throw new Error(error.message)
  return (data ?? []).map(rowToTask)
}
