'use client'

import { useTransition } from 'react'
import { deleteTaskAction } from '../actions'

interface Props {
  id: number
}

export default function DeleteTaskButton({ id }: Props) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      onClick={() => startTransition(() => deleteTaskAction(id))}
      disabled={isPending}
      aria-label="Delete task"
      className="shrink-0 inline-flex items-center text-xs font-medium text-ink-muted hover:text-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      {isPending ? 'Removing…' : 'Delete'}
    </button>
  )
}
