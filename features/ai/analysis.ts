import { generateText, Output } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import { getTasks } from '@/features/tasks/store'

const TaskAnalysisSchema = z.object({
  summary: z.string().describe('Overall summary of the task list status'),
  priorityTask: z.object({
    id: z.number().describe('ID of the highest-priority task'),
    title: z.string(),
    reason: z.string().describe('Why this task is the top priority'),
  }),
  estimatedTotalHours: z.number().describe('Estimated total hours to complete all tasks'),
  recommendations: z.array(
    z.object({
      taskId: z.number().describe('Unique task ID — do not repeat the same ID twice'),
      action: z.string().describe('What to do with this task'),
      priority: z.enum(['high', 'medium', 'low']),
    })
  ).describe('One recommendation per task — no duplicate taskId'),
  productivityScore: z.number().min(0).max(100).describe('Score from 0 to 100 based on completed tasks'),
})

export type TaskAnalysis = z.infer<typeof TaskAnalysisSchema>

export async function analyzeTasks(): Promise<TaskAnalysis> {
  const tasks = await getTasks()

  const { output } = await generateText({
    model: openai('gpt-4o-mini'),
    output: Output.object({
      schema: TaskAnalysisSchema,
    }),
    prompt: `Analyze these tasks and return a structured analysis:
${JSON.stringify(tasks, null, 2)}

Assess the current state, identify the highest-priority task,
estimate total work hours, and provide concrete recommendations.`,
  })

  return output
}
