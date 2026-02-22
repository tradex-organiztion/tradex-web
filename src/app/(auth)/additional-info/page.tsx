"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus } from "lucide-react"
import { AuthLayout, AuthCard } from "@/components/layout"
import {
  Button,
  TextField,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui"
import { authApi } from "@/lib/api/auth"
import { useAuthStore } from "@/stores/useAuthStore"

/**
 * 회원가입 - 거래소 연동 페이지
 *
 * 소셜 로그인 후 profileCompleted=false인 신규 사용자가
 * 거래소 API 키를 등록하는 페이지
 *
 * POST /api/auth/complete-profile
 * {
 *   "exchangeName": "BYBIT",     // 필수
 *   "apiKey": "xxx",             // 필수
 *   "apiSecret": "xxx",          // 필수
 * }
 */

// 거래소 로고 SVG 컴포넌트
function BinanceLogo({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="20" height="20" rx="4" fill="#F3BA2F"/>
      <path d="M10 4L7.5 6.5L8.56 7.56L10 6.12L11.44 7.56L12.5 6.5L10 4ZM5 9L6.06 10.06L7.12 9L6.06 7.94L5 9ZM10 14L12.5 11.5L11.44 10.44L10 11.88L8.56 10.44L7.5 11.5L10 14ZM12.88 9L13.94 10.06L15 9L13.94 7.94L12.88 9ZM10 8.34L11.66 10L10 11.66L8.34 10L10 8.34Z" fill="white"/>
    </svg>
  )
}

function BybitLogo({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="20" height="20" rx="4" fill="#1E1E1E"/>
      <path d="M5.5 6H8.5C9.33 6 10 6.67 10 7.5C10 8 9.75 8.42 9.37 8.66C9.92 8.9 10.3 9.46 10.3 10.1C10.3 11.01 9.56 11.75 8.65 11.75H5.5V6ZM7 7.3V8.3H8.3C8.58 8.3 8.8 8.08 8.8 7.8C8.8 7.52 8.58 7.3 8.3 7.3H7ZM7 9.3V10.45H8.5C8.78 10.45 9 10.23 9 9.88C9 9.52 8.78 9.3 8.5 9.3H7ZM11.5 8V11.75H12.8V10.5L14.5 8H13L12.15 9.35L11.3 8H11.5Z" fill="#F7A600"/>
    </svg>
  )
}

function BitgetLogo({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="20" height="20" rx="4" fill="#00F0FF" fillOpacity="0.15"/>
      <path d="M6 7.5L10 5L14 7.5V12.5L10 15L6 12.5V7.5Z" stroke="#00C8D4" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M10 5V15M6 7.5L14 12.5M14 7.5L6 12.5" stroke="#00C8D4" strokeWidth="0.8"/>
    </svg>
  )
}

// 지원 거래소 목록 (Figma: 바이낸스, 바이비트, 비트겟)
const EXCHANGES = [
  { value: "BINANCE", label: "바이낸스", logo: BinanceLogo },
  { value: "BYBIT", label: "바이비트", logo: BybitLogo },
  { value: "BITGET", label: "비트겟", logo: BitgetLogo },
] as const

type ExchangeName = (typeof EXCHANGES)[number]["value"]

interface FormData {
  exchangeName: ExchangeName | ""
  apiKey: string
}

interface FormErrors {
  exchangeName?: string
  apiKey?: string
}

export default function AdditionalInfoPage() {
  const router = useRouter()
  const { setProfileCompleted, setUser } = useAuthStore()

  const [formData, setFormData] = useState<FormData>({
    exchangeName: "",
    apiKey: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  // 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.exchangeName) {
      newErrors.exchangeName = "거래소를 선택해주세요"
    }

    if (!formData.apiKey.trim()) {
      newErrors.apiKey = "거래소 API 키를 입력해주세요"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError(null)

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await authApi.completeProfile({
        exchangeName: formData.exchangeName as 'BYBIT',
        apiKey: formData.apiKey,
        apiSecret: formData.apiKey, // Figma에는 Secret 필드 없음, 동일 값 전달
      })

      // 프로필 완성 상태 업데이트
      setProfileCompleted(true)

      // 사용자 정보 업데이트 (UserResponse 직접 반환)
      setUser({
        userId: response.userId,
        email: response.email,
        username: response.username,
        profileImageUrl: response.profileImageUrl,
        socialProvider: response.socialProvider,
        profileCompleted: response.profileCompleted,
      })

      // 메인 페이지로 이동
      router.replace("/home")
    } catch (error: unknown) {
      console.warn("Complete profile error:", error)
      let errorMsg = "거래소 연동에 실패했습니다. API 키 정보를 확인하고 다시 시도해주세요."
      if (error && typeof error === "object") {
        const axiosError = error as {
          response?: { data?: { message?: string } }
          message?: string
        }
        if (axiosError.message === "Network Error" || !axiosError.response) {
          errorMsg = "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요."
        } else if (axiosError.response?.data?.message) {
          errorMsg = axiosError.response.data.message
        }
      }
      setApiError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  // 입력 값 변경 핸들러
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // 에러 클리어
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
    setApiError(null)
  }

  const isFormValid = formData.exchangeName && formData.apiKey.trim()

  return (
    <AuthLayout>
      <AuthCard title="회원가입" className="w-[424px]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            {/* Exchange Select */}
            <div className="flex flex-col gap-2">
              <label className="text-body-1-medium text-label-normal">
                거래소
              </label>
              <Select
                value={formData.exchangeName}
                onValueChange={(value) => handleChange("exchangeName", value)}
                disabled={isLoading}
              >
                <SelectTrigger
                  className={`w-full h-[50px] px-4 rounded-[8px] border bg-white text-body-1-regular ${
                    errors.exchangeName
                      ? "border-error-500 border-[1.5px]"
                      : "border-line-normal"
                  }`}
                >
                  <SelectValue placeholder="거래소 선택" />
                </SelectTrigger>
                <SelectContent>
                  {EXCHANGES.map((exchange) => {
                    const Logo = exchange.logo
                    return (
                      <SelectItem key={exchange.value} value={exchange.value} className="h-[50px] px-3">
                        <span className="flex items-center gap-2">
                          <Logo />
                          {exchange.label}
                        </span>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              {errors.exchangeName && (
                <p className="text-body-2-regular text-error-500">
                  {errors.exchangeName}
                </p>
              )}
            </div>

            {/* 거래소 추가 버튼 */}
            <Button
              type="button"
              variant="secondary"
              className="w-full gap-1"
              disabled={isLoading}
            >
              <Plus className="w-4 h-4" />
              거래소 추가
            </Button>

            {/* API Key */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-body-1-medium text-label-normal">거래소 API 키 입력</label>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                  <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M10 9V14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  <circle cx="10" cy="6.5" r="0.75" fill="currentColor"/>
                </svg>
              </div>
              <TextField
                placeholder="거래소 API 키를 입력해주세요."
                value={formData.apiKey}
                onChange={(e) => handleChange("apiKey", e.target.value)}
                message={apiError ? "유효한 API 키가 아닙니다." : errors.apiKey}
                messageType={(apiError || errors.apiKey) ? "error" : undefined}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* 제출 버튼 */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? "처리 중..." : "회원가입"}
          </Button>

          {/* 로그인 링크 */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-body-1-regular text-label-neutral">
              이미 회원이신가요?
            </span>
            <Link
              href="/login"
              className="text-body-1-medium text-label-normal hover:underline"
            >
              로그인
            </Link>
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
