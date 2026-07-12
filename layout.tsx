import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Objective Reality Matching System',
  description: 'The AI Real Estate Emotion Detoxer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
