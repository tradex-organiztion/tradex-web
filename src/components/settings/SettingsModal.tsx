'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores'
import { useAuthStore } from '@/stores/useAuthStore'
import { exchangeApi } from '@/lib/api'
import type { ExchangeApiKeyResponse } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

type SettingsTab = 'account' | 'general' | 'notification' | 'subscription'

const sidebarTabs: { id: SettingsTab; label: string }[] = [
  { id: 'account', label: '계정 설정' },
  { id: 'general', label: '기본 설정' },
  { id: 'notification', label: '알림 설정' },
  { id: 'subscription', label: '구독 관리' },
]

// 설정 버튼 컴포넌트 (Figma: 1px solid #E6E5E3, borderRadius 6px)
function SettingButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="px-2.5 py-1 text-caption-medium text-label-normal border border-line-normal rounded-md hover:bg-gray-50 transition-colors"
    >
      {children}
    </button>
  )
}

// 연결된 거래소 표시 컴포넌트
function ConnectedExchange({ name, apiKey, onRemove }: { name: string; apiKey: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
        <span className="text-caption-medium text-gray-500">{name.charAt(0)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-caption-medium text-label-normal">{name}</p>
        <p className="text-[10px] text-label-assistive font-mono truncate">{apiKey}</p>
      </div>
      <button
        onClick={onRemove}
        className="p-1 text-label-assistive hover:text-label-danger rounded transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export function SettingsModal() {
  const router = useRouter()
  const { isSettingsOpen, settingsTab, closeSettings, setSettingsTab } = useUIStore()
  const { user, logout, isDemoMode } = useAuthStore()

  // Modal states
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  // Exchange keys from API
  const [exchangeKeys, setExchangeKeys] = useState<ExchangeApiKeyResponse[]>([])

  useEffect(() => {
    if (!isSettingsOpen || isDemoMode) return

    exchangeApi.getAll().catch((err) => {
      console.warn('Exchange keys API error:', err.message)
      return null
    }).then((res) => {
      if (res) setExchangeKeys(res)
    })
  }, [isSettingsOpen, isDemoMode])

  const handleRemoveExchange = async (apiKeyId: number) => {
    if (isDemoMode) return

    await exchangeApi.delete(apiKeyId).catch((err) => {
      console.warn('Exchange key delete error:', err.message)
    })
    setExchangeKeys((prev) => prev.filter((k) => k.id !== apiKeyId))
  }

  const handleExchangeAdded = (newKey: ExchangeApiKeyResponse) => {
    setExchangeKeys((prev) => [...prev, newKey])
    setIsExchangeModalOpen(false)
  }

  const userData = {
    email: user?.email || 'jay@tradx.kr',
    exchanges: exchangeKeys.length > 0
      ? exchangeKeys.map((k) => ({ id: String(k.id), name: k.exchangeName, apiKey: k.apiKey }))
      : isDemoMode
        ? [{ id: '1', name: 'Binance', apiKey: 'xXJDt3nPok3aWjA4Ns' }]
        : [],
  }

  const handleLogout = () => {
    setIsLogoutModalOpen(false)
    closeSettings()
    logout()
    router.replace('/login')
  }

  if (!isSettingsOpen) return null

  return (
    <>
      {/* Settings Modal Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={closeSettings}
        />

        {/* Modal Content - Figma: 968px × 602px, responsive */}
        <div className="relative w-full max-w-[968px] h-[602px] max-h-[90vh] flex rounded-xl overflow-hidden shadow-heavy">
          {/* Left Sidebar - Figma: 210px, #F9F8F7 background */}
          <div className="w-[180px] shrink-0 bg-[#F9F8F7] rounded-l-xl flex flex-col py-6 px-3 md:w-[210px] md:px-4">
            <div className="flex flex-col gap-1">
              {sidebarTabs.map((tab) => {
                const isActive = settingsTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSettingsTab(tab.id)}
                    className={cn(
                      "text-left px-3 py-2 rounded-lg text-body-2-medium transition-colors",
                      isActive
                        ? "bg-white text-label-normal shadow-sm"
                        : "text-label-neutral hover:bg-white/50"
                    )}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Content - Figma: white background */}
          <div className="flex-1 bg-white rounded-r-[10px] flex flex-col overflow-y-auto">
            {/* Content */}
            <div className="px-8 py-6 flex-1">
              {/* 계정 설정 */}
              {settingsTab === 'account' && (
                <AccountSettings
                  userData={userData}
                  onEmailChange={() => setIsEmailModalOpen(true)}
                  onPasswordChange={() => setIsPasswordModalOpen(true)}
                  onExchangeAdd={() => setIsExchangeModalOpen(true)}
                  onExchangeRemove={(id) => handleRemoveExchange(Number(id))}
                />
              )}

              {/* 기본 설정 */}
              {settingsTab === 'general' && <GeneralSettings />}

              {/* 알림 설정 */}
              {settingsTab === 'notification' && <NotificationSettings />}

              {/* 구독 관리 */}
              {settingsTab === 'subscription' && <SubscriptionSettings />}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-modals */}
      <EmailChangeModal
        open={isEmailModalOpen}
        onOpenChange={setIsEmailModalOpen}
        currentEmail={userData.email}
      />
      <PasswordChangeModal
        open={isPasswordModalOpen}
        onOpenChange={setIsPasswordModalOpen}
      />
      <ExchangeAddModal
        open={isExchangeModalOpen}
        onOpenChange={setIsExchangeModalOpen}
        onAdded={handleExchangeAdded}
        isDemoMode={isDemoMode}
      />
      <LogoutConfirmModal
        open={isLogoutModalOpen}
        onOpenChange={setIsLogoutModalOpen}
        onConfirm={handleLogout}
      />
    </>
  )
}

// 계정 설정 탭
function AccountSettings({
  userData,
  onEmailChange,
  onPasswordChange,
  onExchangeAdd,
  onExchangeRemove,
}: {
  userData: { email: string; exchanges: { id: string; name: string; apiKey: string }[] }
  onEmailChange: () => void
  onPasswordChange: () => void
  onExchangeAdd: () => void
  onExchangeRemove: (id: string) => void
}) {
  return (
    <div>
      <h2 className="text-body-1-medium text-label-normal mb-0">계정 설정</h2>
      <div className="border-b border-line-normal mt-4 mb-0" />

      {/* 이메일 */}
      <div className="flex items-center justify-between py-5">
        <div>
          <p className="text-caption-medium text-label-normal">이메일</p>
          <p className="text-[10px] text-label-assistive mt-0.5">{userData.email}</p>
        </div>
        <SettingButton onClick={onEmailChange}>이메일 변경</SettingButton>
      </div>
      <div className="border-b border-line-normal" />

      {/* 비밀번호 */}
      <div className="flex items-center justify-between py-5">
        <div>
          <p className="text-caption-medium text-label-normal">비밀번호</p>
          <p className="text-[10px] text-label-assistive mt-0.5">계정 로그인에 사용할 비밀번호를 설정하세요</p>
        </div>
        <SettingButton onClick={onPasswordChange}>비밀번호 변경</SettingButton>
      </div>
      <div className="border-b border-line-normal" />

      {/* 거래소 */}
      <div className="flex items-start justify-between py-5">
        <div className="flex-1">
          <p className="text-caption-medium text-label-normal">거래소</p>
          <p className="text-[10px] text-label-assistive mt-0.5">내 계정에 연결된 거래소를 확인하세요</p>

          {/* 연결된 거래소 목록 */}
          {userData.exchanges.length > 0 && (
            <div className="mt-3">
              {userData.exchanges.map((exchange) => (
                <ConnectedExchange
                  key={exchange.id}
                  name={exchange.name}
                  apiKey={exchange.apiKey}
                  onRemove={() => onExchangeRemove(exchange.id)}
                />
              ))}
            </div>
          )}
        </div>
        <SettingButton onClick={onExchangeAdd}>거래소 추가</SettingButton>
      </div>
    </div>
  )
}

// 기본 설정 탭
function GeneralSettings() {
  return (
    <div>
      <h2 className="text-body-1-medium text-label-normal mb-0">기본 설정</h2>
      <div className="border-b border-line-normal mt-4 mb-0" />

      {/* 테마 */}
      <div className="py-5">
        <p className="text-caption-medium text-label-normal">테마</p>
        <p className="text-[10px] text-label-assistive mt-0.5">기기에서 사용할 테마를 설정해 보세요.</p>
      </div>
      <div className="border-b border-line-normal" />

      {/* 언어 */}
      <div className="py-5">
        <p className="text-caption-medium text-label-normal">언어</p>
        <p className="text-[10px] text-label-assistive mt-0.5">Tradex에서 사용하는 언어를 변경하세요.</p>
      </div>
    </div>
  )
}

// 알림 설정 탭
function NotificationSettings() {
  return (
    <div>
      <h2 className="text-body-1-medium text-label-normal mb-0">알림 설정</h2>
      <div className="border-b border-line-normal mt-4 mb-0" />

      {/* 푸시 알림 */}
      <div className="py-5">
        <p className="text-caption-medium text-label-normal">푸시 알림</p>
        <p className="text-[10px] text-label-assistive mt-0.5">진입 트리거 알림, 매매 원칙 위반 알림 등의 푸시 알림을 받아볼 수 있습니다.</p>
      </div>
      <div className="border-b border-line-normal" />

      {/* 앱 내 알림 */}
      <div className="py-5">
        <p className="text-caption-medium text-label-normal">앱 내 알림</p>
        <p className="text-[10px] text-label-assistive mt-0.5">Tradex 사용 중에도 즉시 알림을 받아 볼 수 있습니다.</p>
      </div>
    </div>
  )
}

// 구독 관리 탭
const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '무료',
    description: '기본 기능으로 시작하기',
    features: [
      '기본 차트 분석',
      '매매일지 10건/월',
      'AI 분석 3회/일',
      '기본 지표',
    ],
    current: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₩29,900',
    period: '/월',
    description: '트레이더를 위한 프리미엄',
    features: [
      '고급 차트 분석',
      '매매일지 무제한',
      'AI 분석 무제한',
      '고급 지표 + 트리거',
      '실시간 알림',
      '포트폴리오 분석',
    ],
    recommended: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '₩99,900',
    period: '/월',
    description: '팀 및 기관 투자자',
    features: [
      'Pro의 모든 기능',
      '팀 공유 대시보드',
      'API 액세스',
      '전담 매니저',
      '커스텀 리포트',
      '우선 지원',
    ],
  },
]

function SubscriptionSettings() {
  return (
    <div>
      <h2 className="text-body-1-medium text-label-normal mb-0">구독 관리</h2>
      <p className="text-caption-regular text-label-assistive mt-1">
        현재 플랜을 관리하고 업그레이드할 수 있습니다.
      </p>
      <div className="border-b border-line-normal mt-4 mb-6" />

      {/* Plan Cards */}
      <div className="grid grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "relative flex flex-col rounded-xl border p-5 transition-colors",
              plan.recommended
                ? "border-gray-900 bg-gray-50"
                : plan.current
                  ? "border-line-focused bg-white"
                  : "border-line-normal bg-white"
            )}
          >
            {plan.recommended && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gray-900 text-white text-[10px] font-medium rounded-full">
                추천
              </span>
            )}
            <h3 className="text-body-1-bold text-label-normal">{plan.name}</h3>
            <div className="flex items-baseline gap-0.5 mt-2">
              <span className="text-title-1-bold text-label-normal">{plan.price}</span>
              {plan.period && (
                <span className="text-caption-regular text-label-assistive">{plan.period}</span>
              )}
            </div>
            <p className="text-caption-regular text-label-assistive mt-1">{plan.description}</p>

            <div className="border-t border-line-normal my-4" />

            <ul className="flex-1 space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-caption-regular text-label-neutral">
                  <svg className="w-3.5 h-3.5 text-element-positive-default shrink-0" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8L6.5 11.5L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className={cn(
                "mt-4 w-full py-2.5 rounded-lg text-body-2-medium transition-colors",
                plan.current
                  ? "bg-gray-100 text-label-assistive cursor-default"
                  : plan.recommended
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "border border-line-normal text-label-normal hover:bg-gray-50"
              )}
              disabled={plan.current}
            >
              {plan.current ? '현재 플랜' : '업그레이드'}
            </button>
          </div>
        ))}
      </div>

      {/* Billing Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-caption-medium text-label-normal">현재 플랜: Free</p>
            <p className="text-[10px] text-label-assistive mt-0.5">다음 결제일: -</p>
          </div>
          <button className="text-caption-medium text-label-assistive hover:text-label-normal transition-colors">
            결제 내역 보기
          </button>
        </div>
      </div>
    </div>
  )
}

// 이메일 변경 모달
function EmailChangeModal({ open, onOpenChange, currentEmail }: { open: boolean; onOpenChange: (open: boolean) => void; currentEmail: string }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="p-6 rounded-xl shadow-emphasize max-w-md">
        <DialogHeader className="items-center gap-1">
          <DialogTitle className="text-title-2-bold text-label-normal text-center">이메일 변경</DialogTitle>
          <DialogDescription className="text-body-1-medium text-label-neutral text-center">
            로그인에 사용될 이메일 주소를 변경합니다.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-body-2-medium text-label-normal mb-1.5 block">현재 이메일</label>
            <Input value={currentEmail} disabled className="h-[50px] bg-gray-50" />
          </div>
          <div>
            <label className="text-body-2-medium text-label-normal mb-1.5 block">새 이메일</label>
            <Input placeholder="새 이메일 주소를 입력하세요" className="h-[50px]" />
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <Button variant="secondary" className="flex-1 h-12 border-line-normal rounded-lg" onClick={() => onOpenChange(false)}>취소</Button>
          <Button className="flex-1 h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-lg">변경하기</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// 비밀번호 변경 모달
function PasswordChangeModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="p-6 rounded-xl shadow-emphasize max-w-md">
        <DialogHeader className="items-center gap-1">
          <DialogTitle className="text-title-2-bold text-label-normal text-center">비밀번호 변경</DialogTitle>
          <DialogDescription className="text-body-1-medium text-label-neutral text-center">
            안전한 비밀번호로 계정을 보호하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-body-2-medium text-label-normal mb-1.5 block">현재 비밀번호</label>
            <Input type="password" placeholder="현재 비밀번호를 입력하세요" className="h-[50px]" />
          </div>
          <div>
            <label className="text-body-2-medium text-label-normal mb-1.5 block">새 비밀번호</label>
            <Input type="password" placeholder="최소 8자 이상 입력하세요" className="h-[50px]" />
            <p className="text-caption-regular text-label-assistive mt-1">영문, 숫자, 특수문자 조합 8자 이상</p>
          </div>
          <div>
            <label className="text-body-2-medium text-label-normal mb-1.5 block">새 비밀번호 확인</label>
            <Input type="password" placeholder="새 비밀번호를 다시 입력하세요" className="h-[50px]" />
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <Button variant="secondary" className="flex-1 h-12 border-line-normal rounded-lg" onClick={() => onOpenChange(false)}>취소</Button>
          <Button className="flex-1 h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-lg">변경하기</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// 거래소 추가 모달
function ExchangeAddModal({ open, onOpenChange, onAdded, isDemoMode }: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdded: (key: ExchangeApiKeyResponse) => void
  isDemoMode: boolean
}) {
  const [selectedExchange, setSelectedExchange] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!selectedExchange || !apiKey || !secretKey) {
      setError('모든 필드를 입력해주세요.')
      return
    }

    if (isDemoMode) {
      onAdded({
        id: Date.now(),
        exchangeName: selectedExchange,
        apiKey,
        maskedSecret: '****' + secretKey.slice(-4),
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      resetForm()
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const result = await exchangeApi.create({
        exchangeName: selectedExchange,
        apiKey,
        apiSecret: secretKey,
      })
      onAdded(result)
      resetForm()
    } catch (err: unknown) {
      console.warn('Exchange key create error:', err)
      if (err && typeof err === 'object') {
        const axiosError = err as { response?: { data?: { message?: string } }; message?: string }
        if (axiosError.response?.data?.message) {
          setError(axiosError.response.data.message)
        } else if (axiosError.message === 'Network Error') {
          setError('서버에 연결할 수 없습니다.')
        } else {
          setError('API 키 등록에 실패했습니다.')
        }
      } else {
        setError('API 키 등록에 실패했습니다.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setSelectedExchange('')
    setApiKey('')
    setSecretKey('')
    setError('')
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); onOpenChange(v) }}>
      <DialogContent showCloseButton={false} className="p-6 rounded-xl shadow-emphasize max-w-md">
        <DialogHeader className="items-center gap-1">
          <DialogTitle className="text-title-2-bold text-label-normal text-center">거래소 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-body-2-medium text-label-normal mb-1.5 block">거래소 선택</label>
            <div className="grid grid-cols-2 gap-2">
              {['Binance', 'Bybit', 'OKX', 'Bitget'].map((exchange) => (
                <button
                  key={exchange}
                  onClick={() => setSelectedExchange(exchange)}
                  className={cn(
                    "flex items-center justify-center gap-2 px-4 py-3 border rounded-lg transition-colors",
                    selectedExchange === exchange
                      ? "border-gray-900 bg-gray-50"
                      : "border-line-normal hover:border-line-focused hover:bg-gray-50"
                  )}
                >
                  <span className="text-body-2-medium text-label-normal">{exchange}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-body-2-medium text-label-normal mb-1.5 block">API Key</label>
            <Input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="API Key를 입력하세요"
              className="h-[50px]"
            />
          </div>
          <div>
            <label className="text-body-2-medium text-label-normal mb-1.5 block">Secret Key</label>
            <Input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Secret Key를 입력하세요"
              className="h-[50px]"
            />
          </div>
          {error && (
            <p className="text-caption-medium text-label-danger">{error}</p>
          )}
        </div>
        <div className="flex gap-3 mt-4">
          <Button variant="secondary" className="flex-1 h-12 border-line-normal rounded-lg" onClick={() => { resetForm(); onOpenChange(false) }}>취소</Button>
          <Button
            className="flex-1 h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-lg"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? '연결 중...' : '연결하기'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// 로그아웃 확인 모달
function LogoutConfirmModal({ open, onOpenChange, onConfirm }: { open: boolean; onOpenChange: (open: boolean) => void; onConfirm: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="w-[327px] p-4 pt-6 rounded-xl shadow-emphasize">
        <DialogHeader className="items-center">
          <DialogTitle className="text-title-2-bold text-label-normal text-center">로그아웃 하시겠습니까?</DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex-row gap-3 mt-2">
          <Button variant="secondary" className="flex-1 h-12 border-line-normal rounded-lg" onClick={() => onOpenChange(false)}>취소</Button>
          <Button className="flex-1 h-12 bg-gray-800 hover:bg-gray-700 text-white rounded-lg" onClick={onConfirm}>로그아웃</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
