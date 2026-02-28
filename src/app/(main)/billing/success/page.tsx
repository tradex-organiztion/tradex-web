'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { subscriptionApi } from '@/lib/api'
import type { SubscriptionPlan } from '@/lib/api'

export default function BillingSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const authKey = searchParams.get('authKey')
    const customerKey = searchParams.get('customerKey')
    const plan = searchParams.get('plan') as SubscriptionPlan | null
    const mode = searchParams.get('mode') // 'change-method' | null

    const processBilling = async () => {
      if (!authKey || !customerKey) {
        setStatus('error')
        setErrorMessage('필수 파라미터가 누락되었습니다.')
        return
      }

      try {
        if (mode === 'change-method') {
          // 결제 수단 변경
          await subscriptionApi.changePaymentMethod({ authKey, customerKey })
        } else {
          // 빌링키 발급 (신규 등록)
          if (!plan) {
            setStatus('error')
            setErrorMessage('플랜 정보가 누락되었습니다.')
            return
          }
          await subscriptionApi.issueBillingKey({ authKey, customerKey, plan })
        }
        setStatus('success')
        // 설정 모달(구독 탭)로 이동
        setTimeout(() => {
          router.replace('/home?settings=subscription')
        }, 1500)
      } catch (err: unknown) {
        console.warn('Billing process error:', err)
        setStatus('error')

        if (err && typeof err === 'object') {
          const axiosError = err as {
            response?: { data?: { message?: string } }
            message?: string
          }
          if (axiosError.message === 'Network Error' || !axiosError.response) {
            setErrorMessage('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.')
          } else if (axiosError.response?.data?.message) {
            setErrorMessage(axiosError.response.data.message)
          } else {
            setErrorMessage('결제 처리에 실패했습니다. 다시 시도해주세요.')
          }
        } else {
          setErrorMessage('결제 처리에 실패했습니다. 다시 시도해주세요.')
        }
      }
    }

    processBilling()
  }, [searchParams, router])

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md px-6">
        {status === 'processing' && (
          <>
            <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto" />
            <p className="text-title-2-bold text-label-normal mt-6">결제 처리 중...</p>
            <p className="text-body-2-regular text-label-neutral mt-2">잠시만 기다려주세요.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-title-2-bold text-label-normal mt-6">결제가 완료되었습니다</p>
            <p className="text-body-2-regular text-label-neutral mt-2">설정 페이지로 이동합니다...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <p className="text-title-2-bold text-label-normal mt-6">결제 처리 실패</p>
            <p className="text-body-2-regular text-label-neutral mt-2">{errorMessage}</p>
            <button
              onClick={() => router.replace('/home?settings=subscription')}
              className="mt-6 px-6 py-3 bg-gray-900 text-white rounded-lg text-body-2-medium hover:bg-gray-800 transition-colors"
            >
              설정으로 돌아가기
            </button>
          </>
        )}
      </div>
    </div>
  )
}
