interface Props {
  completed: boolean
  className?: string
}

export default function TaskStatusBadge({ completed, className = '' }: Props) {
  const base =
    'inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full'
  const variant = completed
    ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
    : 'bg-surface-subtle text-ink-muted ring-1 ring-border'

  return (
    <span className={`${base} ${variant} ${className}`}>
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rounded-full ${
          completed ? 'bg-emerald-500' : 'bg-ink-soft'
        }`}
      />
      {completed ? 'Completed' : 'Pending'}
    </span>
  )
}
