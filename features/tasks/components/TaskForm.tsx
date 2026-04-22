'use client'

import { useActionState, useEffect, useRef } from 'react'
import { createTaskAction } from '../actions'
import { initialTaskFormState, type TaskFormState } from '../types'

async function reducer(_state: TaskFormState, formData: FormData) {
  return createTaskAction(formData)
}

export default function TaskForm() {
  const [state, action, isPending] = useActionState(reducer, initialTaskFormState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) formRef.current?.reset()
  }, [state.success])

  return (
    <form
      ref={formRef}
      action={action}
      className="bg-white border border-border rounded-2xl p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-ink">New task</h3>
        <span className="text-xs text-ink-muted">Add and organize your work</span>
      </div>

      {state.error && (
        <p
          role="alert"
          className="mb-3 text-sm text-brand-700 bg-brand-50 border border-brand-200 rounded-lg px-3 py-2"
        >
          {state.error}
        </p>
      )}

      <div className="space-y-3">
        <input
          name="title"
          placeholder="Task title"
          className="w-full border border-border rounded-lg px-3 py-2.5 text-sm placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
        />
        <input
          name="description"
          placeholder="Description (optional)"
          className="w-full border border-border rounded-lg px-3 py-2.5 text-sm placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
        />
        <button
          type="submit"
          disabled={isPending}
          className="w-full inline-flex items-center justify-center gap-2 bg-brand-500 text-white font-medium py-2.5 rounded-lg text-sm shadow-sm hover:bg-brand-600 active:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? 'Creating…' : 'Create task'}
        </button>
      </div>
    </form>
  )
}
