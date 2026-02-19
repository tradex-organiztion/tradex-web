"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthLayout, AuthCard, SocialLoginButtons, AuthDivider } from "@/components/layout"
import { Button, TextField, Checkbox, IconVisibility, IconVisibilityOff, IconXCircle } from "@/components/ui"
import { authApi } from "@/lib/api/auth"
import { useAuthStore } from "@/stores/useAuthStore"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFailScreen, setShowFailScreen] = useState(false)

  const isFormValid = email.trim() !== "" && password.trim() !== ""

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!isFormValid) return

    setIsLoading(true)

    try {
      const response = await authApi.login({ email, password })

      // Zustand store에 로그인 정보 저장
      login(response.user, response.accessToken, response.refreshToken)

      // 로그인 유지 설정 (localStorage vs sessionStorage)
      if (!rememberMe) {
        // rememberMe가 false면 세션 스토리지 사용 고려
        // 현재는 Zustand persist가 localStorage를 사용하므로 추가 로직 필요시 구현
      }

      // 프로필 완성 여부에 따라 리다이렉트
      if (response.user.profileCompleted) {
        router.replace("/home")
      } else {
        router.replace("/additional-info")
      }
    } catch (err: unknown) {
      console.warn("Login error:", err)

      // 에러 메시지 처리
      if (err && typeof err === "object") {
        const axiosError = err as {
          response?: { status?: number; data?: { message?: string } }
          message?: string
        }

        // Network Error (서버 연결 불가) → 실패 전용 화면
        if (axiosError.message === "Network Error" || !axiosError.response) {
          setError("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.")
          setShowFailScreen(true)
        } else if (axiosError.response?.status === 401) {
          setError("이메일 또는 비밀번호가 올바르지 않습니다.")
        } else if (axiosError.response?.status === 404) {
          setError("등록되지 않은 이메일입니다.")
        } else if (axiosError.response?.data?.message) {
          setError(axiosError.response.data.message)
        } else {
          setError("로그인에 실패했습니다. 다시 시도해주세요.")
        }
      } else {
        setError("로그인에 실패했습니다. 다시 시도해주세요.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (showFailScreen) {
    return (
      <AuthLayout>
        <AuthCard title="로그인">
          <div className="flex flex-col items-center py-8">
            <div className="text-[#FF0015] mb-4">
              <IconXCircle size={48} />
            </div>
            <p className="text-title-2-bold text-label-normal text-center mb-2">
              로그인에 실패했습니다
            </p>
            <p className="text-body-1-regular text-label-neutral text-center">
              {error || "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요."}
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => {
              setShowFailScreen(false)
              setError(null)
            }}
          >
            다시 시도
          </Button>
        </AuthCard>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <AuthCard title="로그인">
        {/* Form Section */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Form Fields */}
          <div className="flex flex-col gap-4">
            <TextField
              label="이메일"
              type="email"
              placeholder="example@tradex.kr"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError(null)
              }}
              disabled={isLoading}
              messageType={error ? "error" : undefined}
            />
            <TextField
              label="비밀번호"
              type={showPassword ? "text" : "password"}
              placeholder="내용을 입력하세요"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(null)
              }}
              disabled={isLoading}
              messageType={error ? "error" : undefined}
              message={error ? undefined : undefined}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-300 hover:text-gray-500"
                >
                  {showPassword ? (
                    <IconVisibilityOff size={24} />
                  ) : (
                    <IconVisibility size={24} />
                  )}
                </button>
              }
            />
          </div>

          {/* Error Message - Inline with icon (Figma pattern) */}
          {error && (
            <div className="flex items-center gap-1">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="9" r="8" fill="#FF0015"/>
                <path d="M6.5 6.5L11.5 11.5M11.5 6.5L6.5 11.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p className="text-body-2-regular text-[#FF0015]">{error}</p>
            </div>
          )}

          {/* Remember Me & Find Links */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                disabled={isLoading}
              />
              <span className="text-body-1-regular text-gray-800">로그인 유지</span>
            </label>

            <div className="flex items-center gap-2 text-body-1-medium text-gray-600">
              <Link href="/find-account?tab=id" className="hover:text-gray-800 px-0.5 py-1">
                아이디 찾기
              </Link>
              <span className="w-px h-3 bg-gray-300" />
              <Link href="/find-account?tab=password" className="hover:text-gray-800 px-0.5 py-1">
                비밀번호 찾기
              </Link>
            </div>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>
        </form>

        {/* Divider */}
        <AuthDivider />

        {/* Social Login */}
        <SocialLoginButtons />

        {/* Sign Up Link */}
        <div className="flex items-center justify-center gap-2 text-body-1-regular text-gray-600">
          <span>아직 회원이 아니신가요?</span>
          <Link
            href="/signup"
            className="text-body-1-medium text-gray-600 hover:text-gray-800 px-0.5 py-1"
          >
            회원가입
          </Link>
        </div>

      </AuthCard>
    </AuthLayout>
  )
}
