'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { SettingsTabNav } from '@/components/settings'

type ThemeMode = 'system' | 'light' | 'dark'
type Language = 'ko' | 'en'

const themeOptions: { value: ThemeMode; label: string }[] = [
  { value: 'system', label: '시스템 설정' },
  { value: 'light', label: '라이트 모드' },
  { value: 'dark', label: '다크 모드' },
]

const languageOptions: { value: Language; label: string }[] = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: '영어' },
]

export default function PreferencesPage() {
  const [theme, setTheme] = useState<ThemeMode>('system')
  const [language, setLanguage] = useState<Language>('ko')

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
          {/* 테마 설정 */}
          <div className="space-y-3">
            <div className="space-y-1">
              <h2 className="text-body-1-medium text-label-normal">테마</h2>
              <p className="text-body-2-regular text-label-neutral">
                기기에서 사용할 테마를 설정하세요.
              </p>
            </div>
            <div className="border border-line-normal rounded-lg overflow-hidden">
              {themeOptions.map((option, i) => (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={cn(
                    "flex items-center w-full px-4 py-3 gap-2 transition-colors",
                    i < themeOptions.length - 1 && "border-b border-line-normal",
                    theme === option.value ? "bg-white" : "hover:bg-gray-50"
                  )}
                >
                  <span className="flex-1 text-left py-0.5 text-body-1-regular text-label-normal">
                    {option.label}
                  </span>
                  {theme === option.value && (
                    <Image src="/icons/icon-system-success.svg" alt="selected" width={24} height={24} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 언어 설정 */}
          <div className="space-y-3">
            <div className="space-y-1">
              <h2 className="text-body-1-medium text-label-normal">언어</h2>
              <p className="text-body-2-regular text-label-neutral">
                Tradex에서 사용하는 언어를 변경하세요.
              </p>
            </div>
            <div className="border border-line-normal rounded-lg overflow-hidden">
              {languageOptions.map((option, i) => (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => setLanguage(option.value)}
                  className={cn(
                    "flex items-center w-full px-4 py-3 gap-2 transition-colors",
                    i < languageOptions.length - 1 && "border-b border-line-normal",
                    language === option.value ? "bg-white" : "hover:bg-gray-50"
                  )}
                >
                  <span className="flex-1 text-left py-0.5 text-body-1-regular text-label-normal">
                    {option.label}
                  </span>
                  {language === option.value && (
                    <Image src="/icons/icon-system-success.svg" alt="selected" width={24} height={24} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
