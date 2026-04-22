export default function TasksSkeleton() {
  return (
    <ul className="space-y-3" aria-label="Loading tasks">
      {[0, 1, 2].map(i => (
        <li
          key={i}
          className="bg-white border border-border rounded-2xl p-4 animate-pulse"
        >
          <div className="h-4 w-3/4 rounded bg-stone-200" />
          <div className="mt-2 h-3 w-1/2 rounded bg-stone-200" />
          <div className="mt-4 h-5 w-20 rounded-full bg-stone-200" />
        </li>
      ))}
    </ul>
  )
}
