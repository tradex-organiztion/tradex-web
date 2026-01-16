"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthLayout, AuthCard } from "@/components/layout"
import {
  Button,
  TextField,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  IconVisibility,
  IconVisibilityOff,
} from "@/components/ui"
import { authApi } from "@/lib/api/auth"
import { useAuthStore } from "@/stores/useAuthStore"

/**
 * 추가 정보 입력 페이지
 *
 * 소셜 로그인 후 profileCompleted=false인 신규 사용자가
 * 거래소 API 키를 등록하는 페이지
 *
 * POST /api/auth/complete-profile
 * {
 *   "username": "홍길동",        // 선택
 *   "exchangeName": "binance",  // 필수
 *   "apiKey": "xxx",            // 필수
 *   "apiSecret": "xxx"          // 필수
 * }
 */

// 지원 거래소 목록
const EXCHANGES = [
  { value: "binance", label: "Binance" },
  { value: "upbit", label: "Upbit" },
  { value: "bybit", label: "Bybit" },
  { value: "bithumb", label: "Bithumb" },
] as const

type ExchangeName = (typeof EXCHANGES)[number]["value"]

interface FormData {
  username: string
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
  const { setProfileCompleted, setUser, user } = useAuthStore()

  const [formData, setFormData] = useState<FormData>({
    username: "",
    exchangeName: "",
    apiKey: "",
    apiSecret: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showApiSecret, setShowApiSecret] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  // 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.exchangeName) {
      newErrors.exchangeName = "거래소를 선택해주세요"
    }

    if (!formData.apiKey.trim()) {
      newErrors.apiKey = "API Key를 입력해주세요"
    }

    if (!formData.apiSecret.trim()) {
      newErrors.apiSecret = "API Secret을 입력해주세요"
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
        username: formData.username || undefined,
        exchangeName: formData.exchangeName as string,
        apiKey: formData.apiKey,
        apiSecret: formData.apiSecret,
      })

      // 프로필 완성 상태 업데이트
      setProfileCompleted(true)

      // 사용자 정보 업데이트
      if (response.user) {
        setUser(response.user)
      }

      // 메인 페이지로 이동
      router.replace("/home")
    } catch (error) {
      console.error("Complete profile error:", error)
      setApiError(
        "프로필 저장에 실패했습니다. API 키 정보를 확인하고 다시 시도해주세요."
      )
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

  return (
    <AuthLayout>
      <AuthCard title="추가 정보" className="w-[424px]">
        <p className="text-body-1-regular text-[#6D7882] text-center -mt-4 mb-2">
          더 나은 서비스를 위해 거래소 API를 연동해주세요
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Username (선택) */}
          <TextField
            label="닉네임"
            placeholder="닉네임을 입력해주세요 (선택)"
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
            disabled={isLoading}
          />

          {/* Exchange Select (필수) */}
          <div className="flex flex-col gap-2">
            <label className="text-body-1-medium text-gray-800">
              거래소 <span className="text-[#FF0015]">*</span>
            </label>
            <Select
              value={formData.exchangeName}
              onValueChange={(value) => handleChange("exchangeName", value)}
              disabled={isLoading}
            >
              <SelectTrigger
                className={`w-full h-[50px] px-4 rounded-[8px] border bg-gray-0 text-body-1-regular ${
                  errors.exchangeName
                    ? "border-red-500 border-[1.5px]"
                    : "border-gray-200"
                }`}
              >
                <SelectValue placeholder="거래소를 선택해주세요" />
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
              <p className="text-body-2-regular text-red-500">
                {errors.exchangeName}
              </p>
            )}
          </div>

          {/* API Key (필수) */}
          <TextField
            label={
              <>
                API Key <span className="text-[#FF0015]">*</span>
              </>
            }
            placeholder="API Key를 입력해주세요"
            value={formData.apiKey}
            onChange={(e) => handleChange("apiKey", e.target.value)}
            message={errors.apiKey}
            messageType={errors.apiKey ? "error" : undefined}
            disabled={isLoading}
          />

          {/* API Secret (필수) */}
          <TextField
            label={
              <>
                API Secret <span className="text-[#FF0015]">*</span>
              </>
            }
            type={showApiSecret ? "text" : "password"}
            placeholder="API Secret을 입력해주세요"
            value={formData.apiSecret}
            onChange={(e) => handleChange("apiSecret", e.target.value)}
            message={errors.apiSecret}
            messageType={errors.apiSecret ? "error" : undefined}
            disabled={isLoading}
            rightElement={
              <button
                type="button"
                onClick={() => setShowApiSecret(!showApiSecret)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showApiSecret ? (
                  <IconVisibilityOff className="size-5" />
                ) : (
                  <IconVisibility className="size-5" />
                )}
              </button>
            }
          />

          {/* API 안내 메시지 */}
          <div className="bg-[#F4F5F6] rounded-[8px] p-4">
            <p className="text-body-2-regular text-[#6D7882]">
              API 키는 안전하게 암호화되어 저장됩니다.
              <br />
              거래소에서 &quot;읽기 전용&quot; 권한만 부여해주세요.
            </p>
          </div>

          {/* API 에러 메시지 */}
          {apiError && (
            <div className="bg-[#FFF9F9] border border-[#FF0015] rounded-[8px] p-4">
              <p className="text-body-2-regular text-[#FF0015]">{apiError}</p>
            </div>
          )}

          {/* 제출 버튼 */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "저장 중..." : "시작하기"}
          </Button>

          {/* 나중에 하기 링크 */}
          <button
            type="button"
            onClick={() => router.replace("/home")}
            className="text-body-2-regular text-[#8A949E] hover:text-[#6D7882] underline"
            disabled={isLoading}
          >
            나중에 설정하기
          </button>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
