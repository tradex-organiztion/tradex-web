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

// 지원 거래소 목록
const EXCHANGES = [
  { value: "BYBIT", label: "Bybit" },
] as const

type ExchangeName = (typeof EXCHANGES)[number]["value"]

interface FormData {
  exchangeName: ExchangeName | ""
  apiKey: string
  apiSecret: string
}

interface FormErrors {
  exchangeName?: string
  apiKey?: string
  apiSecret?: string
}

export default function AdditionalInfoPage() {
  const router = useRouter()
  const { setProfileCompleted, setUser } = useAuthStore()

  const [formData, setFormData] = useState<FormData>({
    exchangeName: "",
    apiKey: "",
    apiSecret: "",
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

    if (!formData.apiSecret.trim()) {
      newErrors.apiSecret = "거래소 API Secret을 입력해주세요"
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
        apiSecret: formData.apiSecret,
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
      if (error && typeof error === "object") {
        const axiosError = error as {
          response?: { data?: { message?: string } }
          message?: string
        }
        if (axiosError.message === "Network Error" || !axiosError.response) {
          setApiError("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.")
        } else if (axiosError.response?.data?.message) {
          setApiError(axiosError.response.data.message)
        } else {
          setApiError("프로필 저장에 실패했습니다. API 키 정보를 확인하고 다시 시도해주세요.")
        }
      } else {
        setApiError("프로필 저장에 실패했습니다. API 키 정보를 확인하고 다시 시도해주세요.")
      }
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

  const isFormValid = formData.exchangeName && formData.apiKey.trim() && formData.apiSecret.trim()

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
                  {EXCHANGES.map((exchange) => (
                    <SelectItem key={exchange.value} value={exchange.value}>
                      {exchange.label}
                    </SelectItem>
                  ))}
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
            <TextField
              label="거래소 API 키 입력"
              placeholder="거래소 API 키를 입력해주세요."
              value={formData.apiKey}
              onChange={(e) => handleChange("apiKey", e.target.value)}
              message={errors.apiKey}
              messageType={errors.apiKey ? "error" : undefined}
              disabled={isLoading}
            />

            {/* API Secret */}
            <TextField
              label="거래소 API Secret 입력"
              placeholder="거래소 API Secret을 입력해주세요."
              value={formData.apiSecret}
              onChange={(e) => handleChange("apiSecret", e.target.value)}
              message={errors.apiSecret}
              messageType={errors.apiSecret ? "error" : undefined}
              disabled={isLoading}
            />
          </div>

          {/* API 에러 메시지 */}
          {apiError && (
            <div className="bg-error-100 border border-error-500 rounded-[8px] p-4">
              <p className="text-body-2-regular text-error-500">{apiError}</p>
            </div>
          )}

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
