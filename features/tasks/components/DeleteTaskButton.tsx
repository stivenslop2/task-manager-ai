'use client'

import { useState, useTransition } from 'react'
import { deleteTaskAction } from '../actions'
import { ConfirmDialog, useToast } from '@/components/ui'

interface Props {
  id: number
  title: string
}

export default function DeleteTaskButton({ id, title }: Props) {
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const toast = useToast()

  function handleConfirm() {
    startTransition(async () => {
      try {
        await deleteTaskAction(id)
        toast.show('Task deleted', 'success')
      } catch {
        toast.show('Could not delete task', 'error')
      }
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={isPending}
        aria-label={`Delete task: ${title}`}
        className="shrink-0 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-ink-muted hover:text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <span aria-hidden>🗑</span>
        {isPending ? 'Removing…' : 'Delete'}
      </button>
      <ConfirmDialog
        open={open}
        destructive
        title="Delete this task?"
        description={`"${title}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirm}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
