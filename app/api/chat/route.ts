import { convertToModelMessages, streamText, UIMessage, stepCountIs } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import { getTasks, getTaskById, createTask, searchSimilarTasks } from '@/features/tasks/store'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: `You are an expert productivity assistant with access to the user's tasks.
When the user asks about tasks, FIRST use searchTasks for semantic/contextual lookups
before falling back to getTasks to list everything.
Always respond in English.`,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools: {
      searchTasks: {
        description: `Search tasks by semantic meaning.
Use this when the user mentions a topic, context, or type of task.
Examples: "programming tasks", "pending health items", "hard tasks".`,
        inputSchema: z.object({
          query: z.string().describe('The topic or context to search for'),
          limit: z.number().optional().describe('Max results, defaults to 5'),
        }),
        execute: async ({ query, limit }: { query: string; limit?: number }) => {
          const tasks = await searchSimilarTasks(query, limit ?? 5)
          if (tasks.length === 0) {
            return { message: 'No tasks matched that topic' }
          }
          return tasks
        },
      },

      getTasks: {
        description: 'Returns the full list of tasks. Use only when the user wants to see ALL their tasks.',
        inputSchema: z.object({}),
        execute: async () => await getTasks(),
      },
      getTaskById: {
        description: 'Returns the details of a specific task by ID.',
        inputSchema: z.object({
          id: z.number().describe('Numeric task ID'),
        }),
        execute: async ({ id }: { id: number }) => {
          const task = await getTaskById(id)
          if (!task) return { error: `Task with ID ${id} was not found` }
          return task
        },
      },
      createTask: {
        description: 'Creates a new task for the user.',
        inputSchema: z.object({
          title: z.string().describe('Task title'),
          description: z.string().describe('Detailed description'),
        }),
        execute: async ({ title, description }: { title: string; description: string }) => {
          const task = await createTask(title, description)
          return { success: true, task }
        },
      },
      getTasksSummary: {
        description: 'Statistical summary: total, completed, and pending tasks.',
        inputSchema: z.object({}),
        execute: async () => {
          const tasks = await getTasks()
          return {
            total: tasks.length,
            completed: tasks.filter(t => t.completed).length,
            pending: tasks.filter(t => !t.completed).length,
          }
        },
      },
    },
  })

  return result.toUIMessageStreamResponse()
}