'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Check, CreditCard, X as XIcon } from 'lucide-react'
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

const TABS: { id: SettingsTab; label: string }[] = [
  { id: 'account', label: '계정' },
  { id: 'general', label: '기본' },
  { id: 'notification', label: '알림' },
  { id: 'subscription', label: '구독' },
]

// Toggle switch component
function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors",
        checked ? "bg-gray-900" : "bg-gray-300"
      )}
    >
      <span className={cn(
        "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform mt-0.5",
        checked ? "translate-x-[22px]" : "translate-x-0.5"
      )} />
    </button>
  )
}

// Radio option component
function RadioOption({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between px-4 py-3 border-b border-line-normal last:border-b-0 hover:bg-gray-50 transition-colors w-full text-left"
    >
      <span className="text-body-2-regular text-label-normal">{label}</span>
      {selected && (
        <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </div>
      )}
    </button>
  )
}

// Exchange icon helper
function ExchangeIcon({ name }: { name: string }) {
  const colors: Record<string, string> = {
    Binance: 'bg-[#F3BA2F]',
    바이낸스: 'bg-[#F3BA2F]',
    Bybit: 'bg-[#F7A600]',
    바이비트: 'bg-[#F7A600]',
  }
  const bg = colors[name] || 'bg-gray-400'

  return (
    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white text-caption-bold", bg)}>
      {name.charAt(0)}
    </div>
  )
}

export function SettingsModal() {
  const router = useRouter()
  const { isSettingsOpen, settingsTab, closeSettings, setSettingsTab } = useUIStore()
  const { user, logout, isDemoMode } = useAuthStore()

  // Modal states
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

  const exchanges = exchangeKeys.length > 0
    ? exchangeKeys.map((k) => ({ id: String(k.id), name: k.exchangeName, active: k.active }))
    : isDemoMode
      ? [
          { id: '1', name: '바이낸스', active: true },
          { id: '2', name: '바이비트', active: false },
        ]
      : []

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

        {/* Modal Content - Figma: horizontal tabs, white background */}
        <div className="relative w-full max-w-[780px] max-h-[90vh] bg-white rounded-xl overflow-hidden shadow-heavy flex flex-col">
          {/* Horizontal Tabs - Figma style */}
          <div className="flex border-b border-line-normal px-8 pt-6">
            {TABS.map((tab) => {
              const isActive = settingsTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setSettingsTab(tab.id)}
                  className={cn(
                    "px-6 pb-3 text-body-1-medium transition-colors relative",
                    isActive
                      ? "text-label-normal"
                      : "text-label-assistive hover:text-label-neutral"
                  )}
                >
                  {tab.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-900" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            {settingsTab === 'account' && (
              <AccountSettings
                nickname={user?.username || '오정길(Jay)'}
                exchanges={exchanges}
                onPasswordChange={() => setIsPasswordModalOpen(true)}
                onExchangeAdd={() => setIsExchangeModalOpen(true)}
                onExchangeRemove={(id) => handleRemoveExchange(Number(id))}
                onLogout={() => setIsLogoutModalOpen(true)}
              />
            )}
            {settingsTab === 'general' && <GeneralSettings />}
            {settingsTab === 'notification' && <NotificationSettings />}
            {settingsTab === 'subscription' && <SubscriptionSettings />}
          </div>
        </div>
      </div>

      {/* Sub-modals */}
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

// 계정 설정 탭 - Figma: avatar + nickname, password, exchange API, logout
function AccountSettings({
  nickname,
  exchanges,
  onPasswordChange,
  onExchangeAdd,
  onExchangeRemove,
  onLogout,
}: {
  nickname: string
  exchanges: { id: string; name: string; active: boolean }[]
  onPasswordChange: () => void
  onExchangeAdd: () => void
  onExchangeRemove: (id: string) => void
  onLogout: () => void
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* 닉네임 - Figma: avatar + input */}
      <div className="flex items-start gap-6">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
          <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
        <div className="flex-1">
          <label className="text-body-2-medium text-label-normal mb-2 block">닉네임</label>
          <Input
            defaultValue={nickname}
            className="h-[48px]"
          />
        </div>
      </div>

      {/* 비밀번호 - Figma: title + description + button */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-body-1-bold text-label-normal">비밀번호</p>
            <p className="text-body-2-regular text-label-neutral mt-1">계정 보안을 위해 정기적으로 비밀번호를 변경하세요.</p>
          </div>
          <button
            onClick={onPasswordChange}
            className="px-4 py-2 text-body-2-medium text-label-normal border border-line-normal rounded-lg hover:bg-gray-50 transition-colors shrink-0"
          >
            비밀번호 변경
          </button>
        </div>
      </div>

      {/* 거래소 API 연동 - Figma: title + description + exchange list */}
      <div>
        <p className="text-body-1-bold text-label-normal">거래소 API 연동</p>
        <p className="text-body-2-regular text-label-neutral mt-1">실시간 매매 데이터를 받아오기 위해 거래소 API를 연동하세요.</p>

        <div className="flex flex-col gap-3 mt-4">
          {exchanges.map((exchange) => (
            <div key={exchange.id} className="flex items-center justify-between px-4 py-3 border border-line-normal rounded-lg">
              <div className="flex items-center gap-3">
                <ExchangeIcon name={exchange.name} />
                <span className="text-body-2-medium text-label-normal">{exchange.name}</span>
                <span className={cn(
                  "text-caption-medium px-2 py-0.5 rounded",
                  exchange.active
                    ? "bg-green-100 text-green-400"
                    : "bg-red-100 text-red-400"
                )}>
                  {exchange.active ? '정상' : '오류'}
                </span>
              </div>
              <button
                onClick={() => onExchangeRemove(exchange.id)}
                className="px-4 py-2 text-body-2-medium text-label-normal border border-line-normal rounded-lg hover:bg-gray-50 transition-colors"
              >
                삭제
              </button>
            </div>
          ))}

          {/* 거래소 추가 버튼 */}
          <button
            onClick={onExchangeAdd}
            className="flex items-center justify-center py-3 border border-line-normal rounded-lg text-body-2-medium text-label-neutral hover:bg-gray-50 transition-colors"
          >
            + 거래소 추가
          </button>
        </div>
      </div>

      {/* 로그아웃 */}
      <div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 text-body-2-medium text-label-neutral border border-line-normal rounded-lg hover:bg-gray-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          로그아웃
        </button>
      </div>
    </div>
  )
}

// 기본 설정 탭 - Figma: theme radio list + language radio list
function GeneralSettings() {
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('system')
  const [language, setLanguage] = useState<'ko' | 'en'>('ko')

  return (
    <div className="flex flex-col gap-8">
      {/* 테마 */}
      <div>
        <p className="text-body-1-bold text-label-normal">테마</p>
        <p className="text-body-2-regular text-label-neutral mt-1">기기에서 사용할 테마를 설정하세요.</p>
        <div className="mt-4 border border-line-normal rounded-lg overflow-hidden">
          <RadioOption label="시스템 설정" selected={theme === 'system'} onClick={() => setTheme('system')} />
          <RadioOption label="라이트 모드" selected={theme === 'light'} onClick={() => setTheme('light')} />
          <RadioOption label="다크 모드" selected={theme === 'dark'} onClick={() => setTheme('dark')} />
        </div>
      </div>

      {/* 언어 */}
      <div>
        <p className="text-body-1-bold text-label-normal">언어</p>
        <p className="text-body-2-regular text-label-neutral mt-1">Tradex에서 사용하는 언어를 변경하세요.</p>
        <div className="mt-4 border border-line-normal rounded-lg overflow-hidden">
          <RadioOption label="한국어" selected={language === 'ko'} onClick={() => setLanguage('ko')} />
          <RadioOption label="영어" selected={language === 'en'} onClick={() => setLanguage('en')} />
        </div>
      </div>
    </div>
  )
}

// 알림 설정 탭 - Figma: push notification toggles
function NotificationSettings() {
  const [pushEnabled, setPushEnabled] = useState(true)
  const [notifications, setNotifications] = useState({
    positionEntry: true,
    positionExit: true,
    riskWarning: true,
    journalReminder: true,
    chartAlert: true,
  })

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="flex flex-col gap-8">
      {/* 푸시 알림 */}
      <div>
        <p className="text-body-1-bold text-label-normal">푸시 알림</p>
        <p className="text-body-2-regular text-label-neutral mt-1">모바일 및 데스크톱 푸시 알림을 설정하세요.</p>
        <div className="mt-4 border border-line-normal rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-body-2-regular text-label-normal">포지션 진입 알림</span>
            <ToggleSwitch checked={pushEnabled} onChange={setPushEnabled} />
          </div>
        </div>
      </div>

      {/* 모든 요금제 */}
      <div>
        <p className="text-body-1-bold text-label-normal">모든 요금제</p>
        <p className="text-body-2-regular text-label-neutral mt-1">비즈니스에 맞는 플랜을 선택하세요.</p>
        <div className="mt-4 border border-line-normal rounded-lg overflow-hidden">
          {[
            { key: 'positionEntry' as const, label: '포지선 진입 알림' },
            { key: 'positionExit' as const, label: '포지션 종료 알림' },
            { key: 'riskWarning' as const, label: '리스크 경고' },
            { key: 'journalReminder' as const, label: '매매 일지 작성 리마인더' },
            { key: 'chartAlert' as const, label: '차트 알림' },
          ].map((item, index, arr) => (
            <div
              key={item.key}
              className={cn(
                "flex items-center justify-between px-4 py-3",
                index < arr.length - 1 && "border-b border-line-normal"
              )}
            >
              <span className="text-body-2-regular text-label-normal">{item.label}</span>
              <ToggleSwitch checked={notifications[item.key]} onChange={() => toggleNotification(item.key)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// 구독 관리 탭 - Figma: current plan + plan cards + payment + billing history
const plans = [
  {
    id: 'free',
    name: '무료',
    price: '₩0',
    period: '/월',
    features: [
      '기본 차트 분석',
      '최대 3개 포지션 추적',
      '주간 리포트',
      '커뮤니티 접근',
    ],
  },
  {
    id: 'pro',
    name: '프로',
    price: '₩29,000',
    period: '/월',
    popular: true,
    current: true,
    features: [
      '무제한 포지션 추적',
      '고급 차트 지표',
      'AI 매매 원칙 추천',
      '일일 리포트',
      '리스크 분석',
      '우선 고객 지원',
    ],
  },
  {
    id: 'premium',
    name: '프리미엄',
    price: '₩99,000',
    period: '/월',
    features: [
      '프로 플랜의 모든 기능',
      '무제한 거래소 연동',
      '실시간 알림',
      '맞춤형 전략 백테스팅',
      'API 접근',
      '전담 계정 매니저',
    ],
  },
]

function SubscriptionSettings() {
  const [isUnsubscribeModalOpen, setIsUnsubscribeModalOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      {/* 현재 요금제 */}
      <div>
        <p className="text-body-1-bold text-label-normal">현재 요금제</p>
        <div className="mt-3 flex items-center justify-between px-4 py-4 border border-line-normal rounded-lg">
          <div>
            <p className="text-body-2-medium text-label-normal">프로 플랜</p>
            <p className="text-caption-regular text-label-assistive">다음 결제일 : 2026.02.28</p>
          </div>
          <span className="text-title-1-bold text-label-normal">₩29,000 <span className="text-body-2-regular text-label-assistive">/월</span></span>
        </div>
      </div>

      {/* 모든 요금제 */}
      <div>
        <p className="text-body-1-bold text-label-normal">모든 요금제</p>
        <p className="text-body-2-regular text-label-neutral mt-1">트레이딩 스타일에 맞는 플랜을 선택하세요.</p>

        <div className="grid grid-cols-3 gap-4 mt-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col rounded-xl border p-5",
                plan.current
                  ? "border-gray-900"
                  : "border-line-normal"
              )}
            >
              <div className="flex items-center gap-2">
                <h3 className="text-body-1-bold text-label-normal">{plan.name}</h3>
                {plan.popular && (
                  <span className="px-2 py-0.5 bg-gray-900 text-white text-[10px] font-medium rounded">
                    인기
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-0.5 mt-3">
                <span className="text-title-1-bold text-label-normal">{plan.price}</span>
                <span className="text-caption-regular text-label-assistive">{plan.period}</span>
              </div>

              <ul className="flex-1 space-y-2 mt-5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-caption-regular text-label-neutral">
                    <div className="w-4 h-4 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={cn(
                  "mt-5 w-full py-2.5 rounded-lg text-body-2-medium transition-colors",
                  plan.current
                    ? "bg-gray-900 text-white"
                    : "border border-line-normal text-label-normal hover:bg-gray-50"
                )}
              >
                {plan.current ? '현재 플랜' : '플랜 변경'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 결제 수단 */}
      <div>
        <p className="text-body-1-bold text-label-normal">결제 수단</p>
        <div className="mt-3 flex flex-col gap-3">
          <div className="flex items-center justify-between px-4 py-3 border border-line-normal rounded-lg">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-label-neutral" />
              <span className="text-body-2-regular text-label-normal">1234-****-****-1234</span>
            </div>
            <button className="px-3 py-1.5 text-caption-medium text-label-normal border border-line-normal rounded-md hover:bg-gray-50 transition-colors">
              변경
            </button>
          </div>
          <button className="flex items-center justify-center py-3 border border-line-normal rounded-lg text-body-2-medium text-label-neutral hover:bg-gray-50 transition-colors">
            + 새 결제 수단 추가
          </button>
        </div>
      </div>

      {/* 결제 내역 */}
      <div>
        <p className="text-body-1-bold text-label-normal">결제 내역</p>
        <div className="mt-3 border border-line-normal rounded-lg overflow-hidden">
          {[
            { plan: '프로 플랜', date: '2026.01.28', amount: '₩29,000' },
            { plan: '프로 플랜', date: '2025.12.28', amount: '₩29,000' },
            { plan: '프로 플랜', date: '2025.11.28', amount: '₩29,000' },
          ].map((item, index, arr) => (
            <div
              key={index}
              className={cn(
                "flex items-center justify-between px-4 py-3",
                index < arr.length - 1 && "border-b border-line-normal"
              )}
            >
              <div>
                <p className="text-body-2-medium text-label-normal">{item.plan}</p>
                <p className="text-caption-regular text-label-assistive">{item.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-caption-medium px-2 py-0.5 bg-green-100 text-green-400 rounded">완료</span>
                <span className="text-body-2-bold text-label-normal">{item.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 구독 해지 */}
      <div>
        <button
          onClick={() => setIsUnsubscribeModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-body-2-medium text-label-neutral border border-line-normal rounded-lg hover:bg-gray-50 transition-colors"
        >
          <XIcon className="w-4 h-4" />
          구독 해지
        </button>
      </div>

      {/* 구독 해지 확인 모달 - Figma L-1 */}
      <UnsubscribeConfirmModal
        open={isUnsubscribeModalOpen}
        onOpenChange={setIsUnsubscribeModalOpen}
        onConfirm={() => {
          setIsUnsubscribeModalOpen(false)
        }}
      />
    </div>
  )
}

// 비밀번호 변경 모달 - Figma: 휴대폰 인증 + 기존/새 비밀번호 + 완료 버튼
function PasswordChangeModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="p-8 rounded-xl shadow-emphasize max-w-md">
        <DialogHeader className="items-center">
          <DialogTitle className="text-title-2-bold text-label-normal text-center">비밀번호 변경</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-6">
          {/* 휴대폰 번호 */}
          <div>
            <label className="text-body-2-medium text-label-normal mb-2 block">휴대폰 번호</label>
            <div className="flex gap-2">
              <Input placeholder="휴대폰 번호를 입력해주세요." className="h-[50px] flex-1" />
              <button className="px-4 py-2.5 border border-line-normal rounded-lg text-body-2-medium text-label-normal hover:bg-gray-50 transition-colors shrink-0">
                인증번호
              </button>
            </div>
            <div className="flex gap-2 mt-2">
              <Input placeholder="인증 번호를 입력해주세요." className="h-[50px] flex-1" />
              <button className="px-4 py-2.5 border border-line-normal rounded-lg text-body-2-medium text-label-normal hover:bg-gray-50 transition-colors shrink-0">
                확인
              </button>
            </div>
          </div>

          {/* 기존 비밀번호 */}
          <div>
            <label className="text-body-2-medium text-label-normal mb-2 block">기존 비밀번호</label>
            <div className="relative">
              <Input
                type={showOldPassword ? 'text' : 'password'}
                placeholder="영문, 숫자, 기호 포함 8~16자"
                className="h-[50px] pr-12"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-label-assistive hover:text-label-neutral"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>

          {/* 새 비밀번호 */}
          <div>
            <label className="text-body-2-medium text-label-normal mb-2 block">새 비밀번호</label>
            <div className="relative">
              <Input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="영문, 숫자, 기호 포함 8~16자"
                className="h-[50px] pr-12"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-label-assistive hover:text-label-neutral"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>

          {/* 새 비밀번호 확인 */}
          <div>
            <label className="text-body-2-medium text-label-normal mb-2 block">새 비밀번호 확인</label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="다시 한번 입력해주세요."
                className="h-[50px] pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-label-assistive hover:text-label-neutral"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 완료 버튼 */}
        <Button
          disabled
          className="w-full h-12 mt-6 bg-gray-100 text-label-disabled rounded-lg disabled:opacity-100"
        >
          완료
        </Button>
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

// 로그아웃 확인 모달 - Figma L-2
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

// 구독 해지 확인 모달 - Figma L-1
function UnsubscribeConfirmModal({ open, onOpenChange, onConfirm }: { open: boolean; onOpenChange: (open: boolean) => void; onConfirm: () => void }) {
  const [reason, setReason] = useState("")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="w-[440px] p-6 rounded-xl shadow-emphasize">
        <DialogHeader className="items-center gap-2">
          <DialogTitle className="text-title-2-bold text-label-normal text-center">플랜을 정말 해지하시겠습니까?</DialogTitle>
          <DialogDescription className="text-body-2-regular text-label-neutral text-center">
            다음 결제일인 2026년 2월 20일에 무료 요금제로 전환됩니다.
          </DialogDescription>
        </DialogHeader>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="해지 이유가 있다면 알려주세요.(선택)"
          className="w-full h-[120px] mt-2 p-4 border border-line-normal rounded-lg text-body-2-regular text-label-normal placeholder:text-label-assistive resize-none focus:outline-none focus:border-line-focused"
        />
        <DialogFooter className="flex-row gap-3 mt-2">
          <Button variant="secondary" className="flex-1 h-12 border-line-normal rounded-lg" onClick={() => onOpenChange(false)}>취소</Button>
          <Button className="flex-1 h-12 bg-gray-800 hover:bg-gray-700 text-white rounded-lg" onClick={onConfirm}>해지</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
