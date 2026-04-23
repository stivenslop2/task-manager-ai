import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, id, className = '', ...rest },
  ref,
) {
  const inputId = id || rest.name
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-ink-muted"
        >
          {label}
        </label>
      )}
      <input
        {...rest}
        id={inputId}
        ref={ref}
        aria-invalid={error ? true : undefined}
        className={`w-full border rounded-lg px-3 py-2.5 text-sm placeholder:text-ink-soft bg-white focus:outline-none focus:ring-2 transition-colors ${
          error
            ? 'border-red-300 focus:ring-red-300 focus:border-red-400'
            : 'border-border focus:ring-brand-400 focus:border-brand-400'
        } ${className}`}
      />
      {(error || hint) && (
        <p className={`text-xs ${error ? 'text-red-600' : 'text-ink-soft'}`}>
          {error || hint}
        </p>
      )}
    </div>
  )
})
