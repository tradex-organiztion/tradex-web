'use client'

import { useState } from 'react'
import { User, Mail, Lock, Building2, ChevronRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

// 설정 항목 타입
interface SettingItem {
  id: string
  label: string
  value?: string
  description?: string
  buttonText: string
  onClick: () => void
}

// 사이드바 메뉴 항목
const sidebarItems = [
  { id: 'profile', label: '프로필', icon: User },
  { id: 'email', label: '이메일', icon: Mail },
  { id: 'password', label: '비밀번호', icon: Lock },
  { id: 'exchange', label: '거래소', icon: Building2 },
]

// 설정 버튼 컴포넌트
function SettingButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-3 py-1.5 text-body-2-medium text-label-normal border border-line-normal rounded-md hover:bg-gray-50 transition-colors"
    >
      {children}
    </button>
  )
}

// 설정 행 컴포넌트
function SettingRow({
  label,
  value,
  description,
  buttonText,
  onClick,
}: SettingItem) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex-1">
        <p className="text-body-2-medium text-label-normal">{label}</p>
        {value && (
          <p className="text-body-2-regular text-label-assistive mt-0.5">{value}</p>
        )}
        {description && (
          <p className="text-body-2-regular text-label-assistive mt-0.5">{description}</p>
        )}
      </div>
      <SettingButton onClick={onClick}>
        {buttonText}
      </SettingButton>
    </div>
  )
}

// 연결된 거래소 컴포넌트
function ConnectedExchange({
  name,
  apiKey,
  onRemove,
}: {
  name: string
  apiKey: string
  onRemove: () => void
}) {
  return (
    <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
      <div>
        <p className="text-body-2-medium text-label-normal">{name}</p>
        <p className="text-caption-regular text-label-assistive font-mono">{apiKey}</p>
      </div>
      <button
        onClick={onRemove}
        className="p-1.5 text-label-assistive hover:text-label-danger hover:bg-red-50 rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default function AccountSettingsPage() {
  const [activeSection, setActiveSection] = useState('profile')
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false)

  // 샘플 사용자 데이터
  const userData = {
    email: 'jay@tradex.kr',
    exchanges: [
      { id: '1', name: 'Binance', apiKey: 'xXJDt3nPok3aWjA4Ns' },
    ],
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-title-1-bold text-gray-800">계정 설정</h1>
        <p className="text-body-2-regular text-gray-600 mt-1">
          계정 정보와 연결된 서비스를 관리하세요.
        </p>
      </div>

      {/* Settings Card */}
      <div className="bg-white rounded-xl border border-line-normal overflow-hidden">
        <div className="flex min-h-[500px]">
          {/* Sidebar */}
          <div className="w-[200px] border-r border-line-normal bg-gray-50/50 p-4">
            <div className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-2-medium transition-colors",
                      isActive
                        ? "bg-white text-label-normal shadow-sm"
                        : "text-label-neutral hover:bg-white/50"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {/* 프로필 섹션 */}
            {activeSection === 'profile' && (
              <div>
                <h2 className="text-title-2-bold text-label-normal mb-1">프로필</h2>
                <p className="text-body-2-regular text-label-assistive mb-6">
                  기본 프로필 정보를 관리하세요.
                </p>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-body-1-medium text-label-normal">프로필 사진</p>
                    <Button variant="secondary" size="sm" className="mt-2">
                      변경하기
                    </Button>
                  </div>
                </div>

                <div className="divide-y divide-line-normal">
                  <SettingRow
                    id="nickname"
                    label="닉네임"
                    value="Jay"
                    buttonText="변경"
                    onClick={() => {}}
                  />
                </div>
              </div>
            )}

            {/* 이메일 섹션 */}
            {activeSection === 'email' && (
              <div>
                <h2 className="text-title-2-bold text-label-normal mb-1">이메일</h2>
                <p className="text-body-2-regular text-label-assistive mb-6">
                  로그인에 사용되는 이메일 주소를 관리하세요.
                </p>

                <div className="divide-y divide-line-normal">
                  <SettingRow
                    id="email"
                    label="이메일"
                    value={userData.email}
                    buttonText="이메일 변경"
                    onClick={() => setIsEmailModalOpen(true)}
                  />
                </div>
              </div>
            )}

            {/* 비밀번호 섹션 */}
            {activeSection === 'password' && (
              <div>
                <h2 className="text-title-2-bold text-label-normal mb-1">비밀번호</h2>
                <p className="text-body-2-regular text-label-assistive mb-6">
                  계정 보안을 위해 비밀번호를 관리하세요.
                </p>

                <div className="divide-y divide-line-normal">
                  <SettingRow
                    id="password"
                    label="비밀번호"
                    description="계정 로그인에 사용할 비밀번호를 설정하세요"
                    buttonText="비밀번호 변경"
                    onClick={() => setIsPasswordModalOpen(true)}
                  />
                </div>
              </div>
            )}

            {/* 거래소 섹션 */}
            {activeSection === 'exchange' && (
              <div>
                <h2 className="text-title-2-bold text-label-normal mb-1">거래소</h2>
                <p className="text-body-2-regular text-label-assistive mb-6">
                  내 계정에 연결된 거래소를 확인하세요.
                </p>

                <div className="space-y-4">
                  {/* 연결된 거래소 목록 */}
                  <div className="space-y-2">
                    {userData.exchanges.map((exchange) => (
                      <ConnectedExchange
                        key={exchange.id}
                        name={exchange.name}
                        apiKey={exchange.apiKey}
                        onRemove={() => {}}
                      />
                    ))}
                  </div>

                  {/* 거래소 추가 버튼 */}
                  <Button
                    variant="secondary"
                    className="gap-2"
                    onClick={() => setIsExchangeModalOpen(true)}
                  >
                    <Building2 className="w-4 h-4" />
                    거래소 추가
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 이메일 변경 모달 */}
      <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>이메일 변경</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-body-2-medium text-label-normal mb-1.5 block">
                현재 이메일
              </label>
              <Input value={userData.email} disabled />
            </div>
            <div>
              <label className="text-body-2-medium text-label-normal mb-1.5 block">
                새 이메일
              </label>
              <Input placeholder="새 이메일 주소를 입력하세요" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="secondary" className="flex-1" onClick={() => setIsEmailModalOpen(false)}>
                취소
              </Button>
              <Button className="flex-1">
                변경하기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 비밀번호 변경 모달 */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>비밀번호 변경</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-body-2-medium text-label-normal mb-1.5 block">
                현재 비밀번호
              </label>
              <Input type="password" placeholder="현재 비밀번호를 입력하세요" />
            </div>
            <div>
              <label className="text-body-2-medium text-label-normal mb-1.5 block">
                새 비밀번호
              </label>
              <Input type="password" placeholder="새 비밀번호를 입력하세요" />
            </div>
            <div>
              <label className="text-body-2-medium text-label-normal mb-1.5 block">
                새 비밀번호 확인
              </label>
              <Input type="password" placeholder="새 비밀번호를 다시 입력하세요" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="secondary" className="flex-1" onClick={() => setIsPasswordModalOpen(false)}>
                취소
              </Button>
              <Button className="flex-1">
                변경하기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 거래소 추가 모달 */}
      <Dialog open={isExchangeModalOpen} onOpenChange={setIsExchangeModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>거래소 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-body-2-medium text-label-normal mb-1.5 block">
                거래소 선택
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Binance', 'Bybit', 'OKX', 'Bitget'].map((exchange) => (
                  <button
                    key={exchange}
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-line-normal rounded-lg hover:border-line-focused hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-body-2-medium text-label-normal">{exchange}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-body-2-medium text-label-normal mb-1.5 block">
                API Key
              </label>
              <Input placeholder="API Key를 입력하세요" />
            </div>
            <div>
              <label className="text-body-2-medium text-label-normal mb-1.5 block">
                Secret Key
              </label>
              <Input type="password" placeholder="Secret Key를 입력하세요" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="secondary" className="flex-1" onClick={() => setIsExchangeModalOpen(false)}>
                취소
              </Button>
              <Button className="flex-1">
                연결하기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
