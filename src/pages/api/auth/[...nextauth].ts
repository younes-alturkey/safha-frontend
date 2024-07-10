import NextAuth, { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { parseJwt } from 'src/@core/utils'
import { RefreshData, refresh } from 'src/api/auth'
import { HTTP } from 'src/types/enums'

interface Credentials {
  email: string
  password: string
}

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
      async authorize(credentials: Credentials | undefined): Promise<AuthUser | null> {
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

      try {
        const now = Math.floor(Date.now() / 1000)
        if (token.tokenExp && now > (token.tokenExp as number)) {
          const url = process.env.API_URL
          if (!url) throw new Error('API_URL is not defined.')

          const tokens: RefreshData = { token: token.token as string, refreshToken: token.refreshToken as string }
          const refreshResponse = await refresh(url, tokens)
          if (refreshResponse?.status === HTTP.OK) {
            const tokens = refreshResponse.data.model
            const parsedToken = parseJwt(tokens.token)

            return {
              ...token,
              ...parsedToken,
              token: tokens.token,
              refreshToken: tokens.refreshToken,
              tokenExp: parsedToken.exp
            }
          }
        }
      } catch (error: any) {
        const err = error.response && error.response.data ? error.response.data : error
        console.error('JWT callback failed:', err)

        return null
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
