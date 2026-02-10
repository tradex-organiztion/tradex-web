'use client'

import { useState } from 'react'
import { CreditCard, Plus, XCircle } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SettingsTabNav } from '@/components/settings'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

interface Plan {
  id: string
  name: string
  price: string
  badge?: string
  features: string[]
  isCurrent: boolean
}

const plans: Plan[] = [
  {
    id: 'free',
    name: '무료',
    price: '₩0',
    features: ['기본 차트 분석', '최대 3개 포지션 추적', '주간 리포트', '커뮤니티 접근'],
    isCurrent: false,
  },
  {
    id: 'pro',
    name: '프로',
    price: '₩29,000',
    badge: '인기',
    features: ['무제한 포지션 추적', '고급 차트 지표', 'AI 매매 원칙 추천', '일일 리포트', '리스크 분석', '우선 고객 지원'],
    isCurrent: true,
  },
  {
    id: 'premium',
    name: '프리미엄',
    price: '₩99,000',
    features: ['프로 플랜의 모든 기능', '무제한 거래소 연동', '실시간 알림', '맞춤형 전략 백테스팅', 'API 접근', '전담 계정 매니저'],
    isCurrent: false,
  },
]

const paymentHistory = [
  { plan: '프로 플랜', date: '2026.01.28', status: '완료', amount: '₩29,000' },
  { plan: '프로 플랜', date: '2025.12.28', status: '완료', amount: '₩29,000' },
  { plan: '프로 플랜', date: '2025.11.28', status: '완료', amount: '₩29,000' },
]

export default function SubscriptionPage() {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState('')

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-title-1-bold text-label-normal">설정</h1>
        <p className="text-body-2-regular text-label-assistive mt-1">
          서비스 이용 환경을 설정하세요.
        </p>
      </div>

      {/* Settings Card */}
      <div className="bg-white rounded-xl border border-line-normal shadow-emphasize overflow-hidden">
        <SettingsTabNav />

        {/* Content */}
        <div className="p-8 space-y-10">
          {/* 현재 요금제 */}
          <div className="space-y-3">
            <h2 className="text-body-1-medium text-label-normal">현재 요금제</h2>
            <div className="border border-line-normal rounded-lg px-4 py-3 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-body-1-regular text-label-normal">프로 플랜</p>
                <p className="text-caption-regular text-label-neutral">다음 결제일 : 2026.02.28</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-title-1-bold text-label-normal">₩29,000</span>
                <span className="text-body-1-regular text-label-neutral">/월</span>
              </div>
            </div>
          </div>

          {/* 모든 요금제 */}
          <div className="space-y-3">
            <div className="space-y-1">
              <h2 className="text-body-1-medium text-label-normal">모든 요금제</h2>
              <p className="text-body-2-regular text-label-neutral">
                트레이딩 스타일에 맞는 플랜을 선택하세요.
              </p>
            </div>
            <div className="space-y-3">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={cn(
                    "p-4 rounded-lg border",
                    plan.isCurrent ? "border-label-normal" : "border-line-normal"
                  )}
                >
                  {/* Plan Header: name + badge left, price right */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-body-1-regular text-label-normal">{plan.name}</span>
                      {plan.badge && (
                        <span className="px-2 py-1 text-caption-medium bg-gray-100 text-label-normal rounded">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-title-1-bold text-label-normal">{plan.price}</span>
                      <span className="text-body-1-regular text-label-neutral">/월</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3">
                        <Image src="/icons/icon-system-success.svg" alt="check" width={24} height={24} className="flex-shrink-0" />
                        <span className="text-body-1-regular text-label-normal">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  {plan.isCurrent ? (
                    <button type="button" className="w-full py-1 px-2 bg-gray-800 text-white text-body-2-medium rounded text-center">
                      현재 플랜
                    </button>
                  ) : (
                    <button type="button" className="w-full py-1 px-2 border border-line-normal text-label-normal text-body-2-medium rounded text-center hover:bg-gray-50 transition-colors">
                      플랜 변경
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 결제 수단 */}
          <div className="space-y-3">
            <h2 className="text-body-1-medium text-label-normal">결제 수단</h2>
            <div className="border border-line-normal rounded-lg px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-label-normal" />
                <span className="py-0.5 text-body-1-regular text-label-normal">1234-****-****-1234</span>
              </div>
              <button type="button" className="px-2 py-1 border border-line-normal rounded text-body-2-medium text-label-normal hover:bg-gray-50 transition-colors">
                변경
              </button>
            </div>
            <button type="button" className="w-full flex items-center justify-center gap-1 px-3 py-2 border border-line-normal rounded-lg text-body-1-medium text-label-normal hover:bg-gray-50 transition-colors">
              <Plus className="w-4 h-4" />
              새 결제 수단 추가
            </button>
          </div>

          {/* 결제 내역 */}
          <div className="space-y-3">
            <h2 className="text-body-1-medium text-label-normal">결제 내역</h2>
            <div className="border border-line-normal rounded-lg overflow-hidden">
              {paymentHistory.map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center justify-between px-4 py-3",
                    i < paymentHistory.length - 1 && "border-b border-line-normal"
                  )}
                >
                  <div className="space-y-0.5">
                    <p className="text-body-1-regular text-label-normal">{item.plan}</p>
                    <p className="text-caption-regular text-label-neutral">{item.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-body-2-medium bg-element-positive-lighter text-element-positive-default rounded">
                      {item.status}
                    </span>
                    <span className="text-body-1-bold text-label-normal">{item.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 구독 해지 */}
          <button
            type="button"
            onClick={() => setIsCancelModalOpen(true)}
            className="flex items-center gap-1 px-3 py-2 border border-line-normal rounded-lg text-body-1-medium text-label-normal hover:bg-gray-50 transition-colors"
          >
            <XCircle className="w-4 h-4" />
            구독 해지
          </button>
        </div>
      </div>

      {/* Cancel Subscription Modal */}
      <Dialog open={isCancelModalOpen} onOpenChange={(open) => {
        setIsCancelModalOpen(open)
        if (!open) setCancelReason('')
      }}>
        <DialogContent showCloseButton={false} className="p-6 rounded-xl shadow-emphasize">
          <DialogHeader className="items-center gap-1">
            <DialogTitle className="text-title-2-bold text-label-normal text-center">
              플랜을 정말 해지하시겠습니까?
            </DialogTitle>
            <DialogDescription className="text-body-1-medium text-label-neutral text-center">
              다음 결제일인 2026년 2월 20일에 무료 요금제로 전환됩니다.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            <textarea
              placeholder="해지 이유가 있다면 알려주세요.(선택)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-4 py-3 border border-line-normal rounded-lg text-body-1-regular placeholder:text-label-assistive focus:outline-none focus:border-line-focused resize-none h-24"
            />
          </div>
          <DialogFooter className="flex-row gap-3 mt-2">
            <Button
              variant="secondary"
              className="flex-1 h-12 border-line-normal rounded-lg"
              onClick={() => setIsCancelModalOpen(false)}
            >
              취소
            </Button>
            <Button
              className="flex-1 h-12 bg-gray-800 hover:bg-gray-700 text-white rounded-lg"
              onClick={() => setIsCancelModalOpen(false)}
            >
              해지
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
