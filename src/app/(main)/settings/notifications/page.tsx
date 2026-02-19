'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUIStore } from '@/stores'

export default function NotificationSettingsPage() {
  const router = useRouter()
  const { openSettings } = useUIStore()

  useEffect(() => {
    openSettings('notification')
    router.replace('/home')
  }, [openSettings, router])

  return null
}
