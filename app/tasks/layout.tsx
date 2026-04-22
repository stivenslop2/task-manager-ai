import Link from 'next/link'

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Task Manager
          </h2>
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Home
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}