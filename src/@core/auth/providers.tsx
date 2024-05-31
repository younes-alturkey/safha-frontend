import { SessionProvider } from 'next-auth/react'
import React, { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => <SessionProvider>{children}</SessionProvider>
