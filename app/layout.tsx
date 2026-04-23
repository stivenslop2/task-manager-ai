import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/ui'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Task Manager AI',
  description:
    'Portfolio project demonstrating streaming text, tool calling, structured outputs, and RAG with pgvector on Next.js 16.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${geist.className} bg-surface-muted text-ink`}
        suppressHydrationWarning
      >
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  )
}
