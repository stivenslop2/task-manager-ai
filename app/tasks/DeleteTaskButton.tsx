'use client'

import { useTransition } from 'react'
import { deleteTaskAction } from './actions'

export default function DeleteTaskButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(() => deleteTaskAction(id))}
      disabled={isPending}
      className="text-red-400 hover:text-red-600 disabled:opacity-40 text-sm shrink-0"
    >
      {isPending ? '...' : 'Eliminar'}
    </button>
  )
}