'use client'
import { SessionProvider } from 'next-auth/react'
import './globals.css'
import { Montserrat } from 'next/font/google'

const inter = Montserrat({ subsets: ['latin'] })


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
        <title>AlChilazo</title>
        <meta name='description' content='AlChilazo es una plataforma de servicio de comida a domicilio' />
      </head>
      <SessionProvider session={session}>
        <body className={inter.className}>{children}</body>
      </SessionProvider>
    </html>
  )
}
