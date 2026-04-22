interface TaskPromptInput {
  title: string
  description?: string | null
}

export function buildStepsPrompt({ title, description }: TaskPromptInput) {
  const desc = description?.trim() || 'No description'

  return `You are a productivity assistant.
Given the task title: "${title}"
And its description: "${desc}"

Produce 3 concrete, actionable steps to complete this task.
Be concise and direct. Maximum 2 sentences per step.`
}
