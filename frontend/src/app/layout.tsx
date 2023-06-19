'use client'
import { SessionProvider } from 'next-auth/react'
import './globals.css'
import { Montserrat } from 'next/font/google'

const inter = Montserrat({ subsets: ['latin'] })

export const metadata = {
  title: 'AlChilazo',
  description: 'AlChilazo es una plataforma de servicio de comida a domicilio.'
}

export default function RootLayout ({
  children,
  session
}: {
  children: React.ReactNode
  session: any
}) {
  return (
    <html lang='es'>
      <head>
        <title>{metadata.title}</title>
        <meta name='description' content={metadata.description} />
      </head>
      <SessionProvider session={session}>
        <body className={inter.className}>{children}</body>
      </SessionProvider>
    </html>
  )
}
