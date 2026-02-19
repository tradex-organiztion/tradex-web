'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUIStore } from '@/stores'

export default function AccountSettingsPage() {
  const router = useRouter()
  const { openSettings } = useUIStore()

  useEffect(() => {
    openSettings('account')
    router.replace('/home')
  }, [openSettings, router])

  return null
}
