'use server'

import { revalidatePath } from 'next/cache'
import { createTask, deleteTask } from './store'
import type { TaskFormState } from './types'

export async function createTaskAction(
  formData: FormData,
): Promise<TaskFormState> {
  const title = (formData.get('title') as string | null)?.trim() ?? ''
  const description =
    (formData.get('description') as string | null)?.trim() ?? ''

  if (!title) {
    return { error: 'Title is required', success: false }
  }

  await createTask(title, description)
  revalidatePath('/tasks')

  return { error: null, success: true }
}

export async function deleteTaskAction(id: number): Promise<void> {
  await deleteTask(id)
  revalidatePath('/tasks')
}
