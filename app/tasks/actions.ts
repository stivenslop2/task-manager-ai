'use server'

import { revalidatePath } from 'next/cache'
import { createTask, deleteTask } from '@/lib/tasks'

export async function createTaskAction(formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string

  if (!title?.trim()) {
    return { error: 'El título es requerido' }
  }

  await createTask(title.trim(), description?.trim() ?? '')
  revalidatePath('/tasks')

  return { success: true }
}

export async function deleteTaskAction(id: number) {
  await deleteTask(id)
  revalidatePath('/tasks')
}