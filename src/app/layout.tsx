import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Amanat Al-Kalima ERP System',
  description: 'Premium ERP System for Amanat Al-Kalima Company - Professional Business Management',
  keywords: 'ERP, Amanat Al-Kalima, Business Management, Invoice, E-Invoice, ZATCA',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-inter">
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </body>
    </html>
  )
}