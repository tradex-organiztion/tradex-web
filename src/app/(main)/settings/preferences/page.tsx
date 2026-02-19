'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUIStore } from '@/stores'

export default function PreferencesPage() {
  const router = useRouter()
  const { openSettings } = useUIStore()

  useEffect(() => {
    openSettings('general')
    router.replace('/home')
  }, [openSettings, router])

  return null
}
