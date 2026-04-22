import { supabase } from '@/lib/supabase'
import { generateEmbedding } from '@/lib/embeddings'
import type { Task } from './types'

// Convierte una fila de Supabase al tipo Task de tu app.
// Supabase devuelve snake_case (created_at), tu tipo usa camelCase (createdAt).
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
  // Generamos el embedding del texto combinado título + descripción.
  // Lo combinamos para que la búsqueda semántica tenga más contexto.
  const embedding = await generateEmbedding(`${title} ${description}`)

  const { data, error } = await supabase
    .from('tm_tasks')
    .insert({
      title,
      description,
      // embedding es el vector de 1536 números que generó OpenAI.
      // Supabase lo guarda en la columna vector(1536) que creaste.
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

// Búsqueda semántica — encuentra tareas por significado, no por palabras exactas.
// Ejemplo: buscar "ejercicio físico" puede encontrar "Ir al gimnasio" aunque
// no contenga esas palabras exactas.
export async function searchSimilarTasks(
  query: string,
  limit: number = 5,
): Promise<Task[]> {
  // 1. Convertimos la búsqueda en vector
  const queryEmbedding = await generateEmbedding(query)

  // 2. Le pedimos a Supabase que encuentre las tareas cuyos vectores
  //    son más cercanos al vector de búsqueda.
  //    match_tm_tasks es una función SQL que crearemos en el Paso 5.
  const { data, error } = await supabase.rpc('match_tm_tasks', {
    query_embedding: queryEmbedding,
    match_threshold: 0.3, // similitud mínima del 30% — filtra resultados muy diferentes
    match_count: limit,
  })

  if (error) throw new Error(error.message)
  return (data ?? []).map(rowToTask)
}