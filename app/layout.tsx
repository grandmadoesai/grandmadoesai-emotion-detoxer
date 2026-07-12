import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'The AI Real Estate Emotion Detoxer',
  description: 'Objective Reality Matching System / ZOPA Filter',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
