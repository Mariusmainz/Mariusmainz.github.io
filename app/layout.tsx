import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import { greatVibes } from '@/lib/fonts'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Marius Mainz Elkjær',
  description: 'MSc Electrical Engineering · IC Design',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} ${greatVibes.variable}`}>{children}</body>
    </html>
  )
}
