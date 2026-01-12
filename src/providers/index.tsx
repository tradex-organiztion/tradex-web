'use client'

import { QueryProvider } from './QueryProvider'
import { Toaster } from '@/components/ui/sonner'
import type { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      {children}
      <Toaster position="top-right" />
    </QueryProvider>
  )
}
