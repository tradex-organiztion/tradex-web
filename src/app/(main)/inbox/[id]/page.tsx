'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

/**
 * 수신함 상세 페이지
 * 수신함 메인 페이지에서 알림을 선택하면 상세 내용을 확인하므로,
 * 이 경로 접근 시 수신함 페이지로 리다이렉트합니다.
 */
export default function InboxDetailPage() {
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    router.replace(`/inbox?notification=${params.id}`)
  }, [router, params.id])

  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-body-1-regular text-label-assistive">수신함으로 이동 중...</p>
    </div>
  )
}
