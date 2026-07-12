import type { Metadata } from 'next'
import './globals.css'
import DisclaimerGate from './components/DisclaimerGate'

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
      <body>
        <DisclaimerGate>{children}</DisclaimerGate>
      </body>
    </html>
  )
}
