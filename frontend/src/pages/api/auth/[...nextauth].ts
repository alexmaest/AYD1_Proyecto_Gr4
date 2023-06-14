import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'text', placeholder: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize (credentials: any, req: any) {
        const { email, password } = credentials
        const res = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            correo: email,
            clave: password
          })
        })
        const user = await res.json()
        if (res.ok && (user !== null || user !== undefined)) {
          return user
        } else return null
      }
    })
  ],

  callbacks: {
    async jwt ({ token, user }) {
      return ({ ...token, ...user })
    },
    async session ({ session, token, user }) {
      session.user = token
      return session
    },
    async redirect ({ url, baseUrl }) {
      return baseUrl
    }
  },

  session: {
    strategy: 'jwt'
  },

  pages: {
    signIn: '/auth/login'
  }
}

export default NextAuth(authOptions)
