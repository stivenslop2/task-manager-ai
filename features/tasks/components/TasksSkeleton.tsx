export default function TasksSkeleton() {
  return (
    <ul className="space-y-2" aria-label="Loading tasks">
      {[0, 1, 2].map((i) => (
        <li
          key={i}
          className="bg-white border border-border rounded-xl p-4 animate-pulse"
          style={{ animationDelay: `${i * 120}ms` }}
        >
          <div className="h-4 w-2/3 rounded bg-surface-subtle" />
          <div className="mt-2 h-3 w-1/2 rounded bg-surface-subtle" />
        </li>
      ))}
    </ul>
  )
}
