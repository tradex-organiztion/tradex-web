'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUIStore } from '@/stores'

export default function SubscriptionPage() {
  const router = useRouter()
  const { openSettings } = useUIStore()

  useEffect(() => {
    openSettings('subscription')
    router.replace('/home')
  }, [openSettings, router])

  return null
}
