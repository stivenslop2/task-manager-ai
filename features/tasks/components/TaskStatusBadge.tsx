interface Props {
  completed: boolean
  className?: string
}

export default function TaskStatusBadge({ completed, className = '' }: Props) {
  const base =
    'inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full'
  const variant = completed
    ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
    : 'bg-brand-50 text-brand-700 ring-1 ring-brand-200'

  return (
    <span className={`${base} ${variant} ${className}`}>
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rounded-full ${
          completed ? 'bg-emerald-500' : 'bg-brand-500'
        }`}
      />
      {completed ? 'Completed' : 'Pending'}
    </span>
  )
}
