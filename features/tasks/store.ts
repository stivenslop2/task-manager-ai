import type { Task } from './types'

// In-memory store. Swapped for a real DB (Supabase / Neon) in a later sprint.
let tasks: Task[] = [
  {
    id: 1,
    title: 'Learn App Router',
    description: 'Complete Sprint 0 of the roadmap.',
    completed: true,
    createdAt: new Date(),
  },
  {
    id: 2,
    title: 'Learn the Vercel AI SDK',
    description: 'Complete Sprint 1 of the roadmap.',
    completed: false,
    createdAt: new Date(),
  },
]

let nextId = 3

// Simulated latency so Suspense fallbacks are visible during development.
const LIST_DELAY_MS = 600
const READ_DELAY_MS = 300
const WRITE_DELAY_MS = 400

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function getTasks(): Promise<Task[]> {
  await wait(LIST_DELAY_MS)
  return tasks
}

export async function getTaskById(id: number): Promise<Task | null> {
  await wait(READ_DELAY_MS)
  return tasks.find(task => task.id === id) ?? null
}

export async function createTask(
  title: string,
  description: string,
): Promise<Task> {
  await wait(WRITE_DELAY_MS)

  const task: Task = {
    id: nextId++,
    title,
    description,
    completed: false,
    createdAt: new Date(),
  }

  tasks.push(task)
  return task
}

export async function deleteTask(id: number): Promise<void> {
  await wait(READ_DELAY_MS)
  tasks = tasks.filter(task => task.id !== id)
}
