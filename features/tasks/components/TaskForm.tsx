'use client'

import { useActionState, useEffect, useRef, useState, useTransition } from 'react'
import { createTaskAction } from '../actions'
import { initialTaskFormState, type TaskFormState } from '../types'
import type { TaskClassification } from '@/app/api/classify-task/route'
import { Button, Card, Input, Textarea, useToast } from '@/components/ui'

async function reducer(_state: TaskFormState, formData: FormData) {
  return createTaskAction(formData)
}

const deadlineLabel: Record<string, string> = {
  today: 'Today',
  'this-week': 'This week',
  'this-month': 'This month',
  someday: 'Someday',
}

const difficultyStyles: Record<string, string> = {
  hard: 'bg-red-50 text-red-700 ring-red-200',
  medium: 'bg-yellow-50 text-yellow-700 ring-yellow-200',
  easy: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
}

export default function TaskForm() {
  const [state, action, isPending] = useActionState(reducer, initialTaskFormState)
  const [classification, setClassification] = useState<TaskClassification | null>(null)
  const [classifying, startClassifying] = useTransition()
  const [, startAction] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)
  const toast = useToast()

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
      toast.show('Task created', 'success')
    }
  }, [state.success, toast])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const title = (formData.get('title') as string)?.trim()
    const description = ((formData.get('description') as string) ?? '').trim()

    if (!title) return

    startAction(() => {
      action(formData)
    })

    setClassification(null)
    startClassifying(async () => {
      try {
        const res = await fetch('/api/classify-task', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description }),
        })
        if (!res.ok) return
        const result = (await res.json()) as TaskClassification
        setClassification(result)
      } catch {
        // Silent — classification is a nice-to-have; the task is already created.
      }
    })
  }

  return (
    <div className="space-y-3">
      <Card className="p-5">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-ink">New task</h3>
            <p className="mt-0.5 text-xs text-ink-muted">
              We auto-classify each task with a structured-output call.
            </p>
          </div>

          {state.error && (
            <p
              role="alert"
              className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
            >
              {state.error}
            </p>
          )}

          <Input
            name="title"
            label="Title"
            placeholder="Write the API docs"
            required
            autoComplete="off"
          />
          <Textarea
            name="description"
            label="Description"
            placeholder="Optional details, context, or acceptance criteria."
            rows={3}
          />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full"
          >
            {isPending ? 'Creating…' : 'Create task'}
          </Button>
        </form>
      </Card>

      {classifying && (
        <Card className="p-4 animate-fade-in">
          <div className="flex items-center gap-2 text-xs text-ink-muted">
            <span className="inline-block animate-spin">⚙️</span>
            Classifying with AI…
          </div>
        </Card>
      )}

      {classification && !classifying && (
        <Card className="p-4 animate-fade-in">
          <p className="text-[11px] font-semibold text-ink-muted uppercase tracking-wide mb-3">
            ✨ AI Classification
          </p>
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-700 ring-1 ring-brand-200">
              {classification.category}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ${
                difficultyStyles[classification.difficulty] ?? difficultyStyles.medium
              }`}
            >
              {classification.difficulty}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-subtle text-ink-muted ring-1 ring-border">
              ⏱ {classification.estimatedMinutes} min
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 ring-1 ring-purple-200">
              📅 {deadlineLabel[classification.suggestedDeadline] ?? classification.suggestedDeadline}
            </span>
            {classification.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-subtle text-ink-muted ring-1 ring-border"
              >
                #{tag}
              </span>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
