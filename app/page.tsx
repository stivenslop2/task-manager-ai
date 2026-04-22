import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">App Router Learning</h1>
      <p className="mt-2 text-gray-600">
        Mi primer proyecto en App Router
      </p>

      <nav className="mt-6 flex flex-col gap-3">
        <Link href="/tasks" className="text-blue-600 hover:underline">
          → Task Manager ✨
        </Link>
      </nav>
    </main>
  )
}