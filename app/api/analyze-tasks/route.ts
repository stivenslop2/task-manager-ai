import { analyzeTasks } from '@/features/ai/analysis'

export async function GET() {
  const output = await analyzeTasks()
  return Response.json(output)
}
