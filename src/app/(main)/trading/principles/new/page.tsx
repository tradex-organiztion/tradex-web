'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * 매매 원칙 등록 페이지
 * 매매 원칙 관리 페이지에서 사이드패널로 PrinciplePanel을 열어 작성하므로,
 * 이 경로 접근 시 매매 원칙 관리 페이지로 리다이렉트합니다.
 */
export default function NewPrinciplePage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/trading/principles?action=new')
  }, [router])

  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-body-1-regular text-label-assistive">매매 원칙 등록 페이지로 이동 중...</p>
    </div>
  )
}
