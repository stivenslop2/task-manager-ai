import { Suspense } from 'react'
import TaskForm from './TaskForm'
import TaskList from './TaskList'
import TasksLoading from './loading'

export default function TasksPage() {
  return (
    <div>
      <TaskForm />

      <Suspense fallback={<TasksLoading />}>
        <TaskList />
      </Suspense>
    </div>
  )
}