import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Agentic App',
    template: '%s | Agentic App',
  },
  description: 'Built with Next.js, Tailwind CSS, and AI agents.',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-sans">
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}
