'use client'

import { useActionState, useRef } from 'react'
import { createTaskAction } from './actions'

const initialState = { error: null as string | null, success: false }

export default function TaskForm() {
  const [state, action, isPending] = useActionState(
    async (_: typeof initialState, formData: FormData) => {
      const result = await createTaskAction(formData)
      if (result.error) return { error: result.error, success: false }
      return { error: null, success: true }
    },
    initialState
  )

  return (
    <form action={action} className="bg-white border rounded-lg p-4 mb-6">
      <h3 className="font-semibold mb-3">Nueva Tarea</h3>

      {state.error && (
        <p className="text-red-600 text-sm mb-3">{state.error}</p>
      )}

      <div className="space-y-3">
        <input
          name="title"
          placeholder="Título de la tarea"
          className="w-full border rounded p-2 text-sm"
        />
        <input
          name="description"
          placeholder="Descripción (opcional)"
          className="w-full border rounded p-2 text-sm"
        />
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-500 text-white py-2 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
        >
          {isPending ? 'Creando...' : 'Crear Tarea'}
        </button>
      </div>
    </form>
  )
}