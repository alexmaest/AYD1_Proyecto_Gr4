import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware (req) {
    if (req.nextUrl.pathname.startsWith('/admin') && req.nextauth.token?.role !== 'Administrador') {
      return NextResponse.rewrite(
        new URL('/auth/unauthorized', req.url)
      )
    }
    if (req.nextUrl.pathname.startsWith('/user') && req.nextauth.token?.role !== 'Usuario') {
      return NextResponse.rewrite(
        new URL('/auth/unauthorized', req.url)
      )
    }
    if (req.nextUrl.pathname.startsWith('/company') && req.nextauth.token?.role !== 'Empresa') {
      return NextResponse.rewrite(
        new URL('/auth/unauthorized', req.url)
      )
    }
    if (req.nextUrl.pathname.startsWith('/delivery') && req.nextauth.token?.role !== 'Repartidor') {
      return NextResponse.rewrite(
        new URL('/auth/unauthorized', req.url)
      )
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !(token == null)
    }
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/user/:path*',
    '/company/:path*',
    '/delivery/:path*'
  ]
}
