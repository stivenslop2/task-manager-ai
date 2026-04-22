export interface Task {
  id: number
  title: string
  description: string
  completed: boolean
  createdAt: Date
}

// Simula DB en memoria
// En el Sprint 2 esto será Supabase o Neon
let tasks: Task[] = [
  {
    id: 1,
    title: 'Aprender App Router',
    description: 'Completar el Sprint 0 del roadmap',
    completed: true,
    createdAt: new Date(),
  },
  {
    id: 2,
    title: 'Aprender Vercel AI SDK',
    description: 'Completar el Sprint 1 del roadmap',
    completed: false,
    createdAt: new Date(),
  },
]

let nextId = 3

export async function getTasks(): Promise<Task[]> {
  await new Promise(resolve => setTimeout(resolve, 600))
  return tasks
}

export async function getTaskById(id: number): Promise<Task | null> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return tasks.find(t => t.id === id) ?? null
}

export async function createTask(
  title: string,
  description: string
): Promise<Task> {
  await new Promise(resolve => setTimeout(resolve, 400))

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
  await new Promise(resolve => setTimeout(resolve, 300))
  tasks = tasks.filter(t => t.id !== id)
}