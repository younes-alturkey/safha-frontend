import NextAuth, { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

interface AuthUser extends User {
  id: string
  email: string
}

export interface UserSession {
  name?: string | null | undefined
  email?: string | null | undefined
  image?: string | null | undefined
  birthdate?: string | null | undefined
  role?: string | null | undefined
  token?: string | null | undefined
  refreshToken?: string | null | undefined
  tokenExp?: string | number | null | undefined
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 7776000 // 90 days
  },
  pages: {
    signIn: '/signin'
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'younes@safha.com' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(): Promise<AuthUser | null> {
        try {
          const user = {
            name: 'Younes Alturkey',
            email: 'younes@safha.com',
            id: '1093654584',
            birthdate: '26/10/1995',
            role: 'customer',
            token: 'token',
            refreshToken: 'refreshtoken',
            tokenExp: Date.now()
          }

          return user
        } catch (error: any) {
          const msg = error.message
          if (msg) console.error('Authorization failed:', msg)
          else console.error('Authorization failed:', error)

          return null
        }
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user)
        return {
          ...user
        }

      return token
    },
    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          name: token.name,
          email: token.email,
          id: token.id,
          birthdate: token.birthdate,
          role: token.role,
          token: token.token,
          refreshToken: token.refreshToken,
          tokenExp: token.tokenExp
        }
      }
    }
  }
}

export default NextAuth(authOptions)
