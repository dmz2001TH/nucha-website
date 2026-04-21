import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

type UserRole = 'ADMIN' | 'EDITOR' | 'VIEWER'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user || !user.isActive) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() }
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = user.role as UserRole
        token.avatar = (user.avatar as string) || null
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
        session.user.avatar = (token.avatar as string) || null
      }
      return session
    }
  },
  pages: {
    signIn: '/admin/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 วัน
  },
  trustHost: true
})

// Type declarations
declare module 'next-auth' {
  interface User {
    role?: 'ADMIN' | 'EDITOR' | 'VIEWER'
    avatar?: string | null
  }
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: 'ADMIN' | 'EDITOR' | 'VIEWER'
      avatar: string | null
    }
  }
}

// Extend JWT type for NextAuth v5
type JWT = {
  id: string
  role: 'ADMIN' | 'EDITOR' | 'VIEWER'
  avatar: string | null
  sub?: string
  name?: string | null
  email?: string | null
  iat?: number
  exp?: number
  jti?: string
}
