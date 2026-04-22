'use client'

import { useActionState, useEffect, useRef, useState, useTransition } from 'react'
import { createTaskAction } from '../actions'
import { initialTaskFormState, type TaskFormState } from '../types'
import type { TaskClassification } from '@/app/api/classify-task/route'

async function reducer(_state: TaskFormState, formData: FormData) {
  return createTaskAction(formData)
}

const deadlineLabel: Record<string, string> = {
  'today': 'Hoy',
  'this-week': 'Esta semana',
  'this-month': 'Este mes',
  'someday': 'Algún día',
}

export default function TaskForm() {
  const [state, action, isPending] = useActionState(reducer, initialTaskFormState)
  const [classification, setClassification] = useState<TaskClassification | null>(null)
  const [classifying, startClassifying] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) formRef.current?.reset()
  }, [state.success])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const description = formData.get('description') as string

    if (!title?.trim()) return

    // 1. Crear la tarea via useActionState (dentro del form nativo)
    action(formData)

    // 2. Clasificar en paralelo via useTransition
    setClassification(null)
    startClassifying(async () => {
      const res = await fetch('/api/classify-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      })
      const result = await res.json() as TaskClassification
      setClassification(result)
    })
  }

  return (
    <div className="space-y-3">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="bg-white border border-border rounded-2xl p-5 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-ink">New task</h3>
          <span className="text-xs text-ink-muted">Add and organize your work</span>
        </div>

        {state.error && (
          <p role="alert" className="mb-3 text-sm text-brand-700 bg-brand-50 border border-brand-200 rounded-lg px-3 py-2">
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
            disabled={isPending || classifying}
            className="w-full inline-flex items-center justify-center gap-2 bg-brand-500 text-white font-medium py-2.5 rounded-lg text-sm shadow-sm hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {classifying ? '✨ Clasificando...' : isPending ? 'Creating…' : 'Create task'}
          </button>
        </div>
      </form>

      {/* Clasificación — aparece justo debajo del form, desaparece al crear otra */}
      {classifying && (
        <div className="bg-white border border-border rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-ink-muted">
            <span className="animate-spin inline-block">⚙️</span>
            Clasificando con IA...
          </div>
        </div>
      )}

      {classification && !classifying && (
        <div className="bg-white border border-border rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-3">
            ✨ AI Classification
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-700 ring-1 ring-brand-200">
              {classification.category}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ring-1 ${
              classification.difficulty === 'hard'
                ? 'bg-red-50 text-red-700 ring-red-200'
                : classification.difficulty === 'medium'
                ? 'bg-yellow-50 text-yellow-700 ring-yellow-200'
                : 'bg-emerald-50 text-emerald-700 ring-emerald-200'
            }`}>
              {classification.difficulty}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 ring-1 ring-gray-200">
              ⏱ {classification.estimatedMinutes}min
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 ring-1 ring-purple-200">
              📅 {deadlineLabel[classification.suggestedDeadline]}
            </span>
            {classification.tags.map(tag => (
              <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium bg-surface-muted text-ink-muted ring-1 ring-border">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}