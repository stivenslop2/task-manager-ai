import type { Task } from './types'

// The store uses globalThis so that Server Actions, Server Components, and
// Route Handlers all share the same in-memory instance across HMR reloads
// and separate bundles. Delete this shim when swapping to a real DB.
interface TaskStoreState {
  tasks: Task[]
  nextId: number
}

const globalRef = globalThis as unknown as { __taskStore?: TaskStoreState }

const state: TaskStoreState = (globalRef.__taskStore ??= {
  tasks: [
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
  ],
  nextId: 3,
})

// Simulated latency so Suspense fallbacks are visible during development.
const LIST_DELAY_MS = 600
const READ_DELAY_MS = 300
const WRITE_DELAY_MS = 400

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function getTasks(): Promise<Task[]> {
  await wait(LIST_DELAY_MS)
  return state.tasks
}

export async function getTaskById(id: number): Promise<Task | null> {
  await wait(READ_DELAY_MS)
  return state.tasks.find(task => task.id === id) ?? null
}

export async function createTask(
  title: string,
  description: string,
): Promise<Task> {
  await wait(WRITE_DELAY_MS)

  const task: Task = {
    id: state.nextId++,
    title,
    description,
    completed: false,
    createdAt: new Date(),
  }

  state.tasks.push(task)
  return task
}

export async function deleteTask(id: number): Promise<void> {
  await wait(READ_DELAY_MS)
  state.tasks = state.tasks.filter(task => task.id !== id)
}
