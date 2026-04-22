export interface Task {
  id: number
  title: string
  description: string
  completed: boolean
  createdAt: Date
}

export interface TaskFormState {
  error: string | null
  success: boolean
}

export const initialTaskFormState: TaskFormState = {
  error: null,
  success: false,
}
