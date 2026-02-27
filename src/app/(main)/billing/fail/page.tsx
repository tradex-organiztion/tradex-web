'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function BillingFailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const errorCode = searchParams.get('code') || ''
  const errorMessage = searchParams.get('message') || '결제가 취소되었거나 오류가 발생했습니다.'

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md px-6">
        <div className="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
        <p className="text-title-2-bold text-label-normal mt-6">결제 실패</p>
        <p className="text-body-2-regular text-label-neutral mt-2">{errorMessage}</p>
        {errorCode && (
          <p className="text-caption-regular text-label-assistive mt-1">오류 코드: {errorCode}</p>
        )}
        <button
          onClick={() => router.replace('/home?settings=subscription')}
          className="mt-6 px-6 py-3 bg-gray-900 text-white rounded-lg text-body-2-medium hover:bg-gray-800 transition-colors"
        >
          다시 시도
        </button>
      </div>
    </div>
  )
}
