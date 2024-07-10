import { withAuth } from 'next-auth/middleware'
import { NextRequest } from 'next/server'

const allowed = [
  '/',
  '/chat',
  '/wizard',
  '/signup',
  '/signout',
  '/reset-password',
  '/new-password',
  '/sheesh',
  '/email-confirmed',
  '/api/openai/thread',
  '/api/openai/message',
  '/api/openai/retrieve',
  '/api/analytics/event',
  '/api/gcp/storage/upload',
  '/api/gcp/storage/delete',
  '/api/generate/logos',
  '/api/generate/images',
  '/api/unsplash/search',
  '/api/download/image',
  '/api/email'
]

const allowedPatterns = [/^\/api\/openai\/messages\/\w+$/, /^\/api\/openai\/run\/\w+$/]

export default withAuth({
  callbacks: {
    authorized: ({ token, req }: { token: any; req: NextRequest }) => {
      const pathname = req.nextUrl.pathname
      const isAllowed = allowed.includes(pathname) || allowedPatterns.some(pattern => pattern.test(pathname))

      return isAllowed || Boolean(token)
    }
  },
  pages: {
    signIn: '/signin',
    error: '/error'
  }
})
