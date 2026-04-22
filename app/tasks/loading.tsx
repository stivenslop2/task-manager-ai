export default function TasksLoading() {
  return (
    <div className="space-y-4">
      <div className="h-10 bg-gray-200 rounded animate-pulse w-48" />
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white border rounded-lg p-4 animate-pulse"
        >
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  )
}