"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthLayout, AuthCard } from "@/components/layout"
import {
  Button,
  TextField,
  IconVisibility,
  IconVisibilityOff,
} from "@/components/ui"
import { authApi } from "@/lib/api/auth"

/**
 * 비밀번호 재설정 페이지
 *
 * URL: /reset-password?token=xxx
 * 이메일로 받은 링크를 통해 접근
 *
 * API: POST /api/auth/reset-password
 * - token: string (URL에서 받음)
 * - newPassword: string (최소 8자)
 */

type ResetStep = "form" | "complete"

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [step, setStep] = useState<ResetStep>("form")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 비밀번호 유효성 검사 (영문, 숫자, 기호 포함 8~16자)
  const isPasswordValid = (pwd: string) => {
    // 최소 8자, 최대 16자
    if (pwd.length < 8 || pwd.length > 16) return false
    // 영문 포함
    if (!/[a-zA-Z]/.test(pwd)) return false
    // 숫자 포함
    if (!/[0-9]/.test(pwd)) return false
    // 기호 포함
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) return false
    return true
  }

  const isFormValid =
    password.trim() !== "" &&
    isPasswordValid(password) &&
    passwordConfirm.trim() !== "" &&
    password === passwordConfirm &&
    token

  // 비밀번호 재설정 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid || isLoading || !token) return

    setIsLoading(true)
    setError(null)

    try {
      await authApi.resetPassword({
        token,
        newPassword: password,
      })
      setStep("complete")
    } catch (err: unknown) {
      console.warn("Reset password error:", err)
      if (err && typeof err === "object") {
        const axiosError = err as {
          response?: { status?: number; data?: { message?: string } }
          message?: string
        }
        if (axiosError.message === "Network Error" || !axiosError.response) {
          setError("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.")
        } else if (axiosError.response?.status === 400) {
          setError("유효하지 않거나 만료된 링크입니다. 비밀번호 찾기를 다시 진행해주세요.")
        } else if (axiosError.response?.data?.message) {
          setError(axiosError.response.data.message)
        } else {
          setError("비밀번호 재설정에 실패했습니다. 다시 시도해주세요.")
        }
      } else {
        setError("비밀번호 재설정에 실패했습니다. 다시 시도해주세요.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoToLogin = () => {
    router.replace("/login")
  }

  // 토큰이 없는 경우
  if (!token) {
    return (
      <AuthLayout>
        <AuthCard className="w-[424px]">
          <div className="flex flex-col items-center gap-6 py-8">
            <p className="text-body-1-regular text-error-500 text-center">
              유효하지 않은 접근입니다.<br />
              비밀번호 찾기를 다시 진행해주세요.
            </p>
            <Button
              type="button"
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => router.replace("/find-account?tab=password")}
            >
              비밀번호 찾기로 이동
            </Button>
          </div>
        </AuthCard>
      </AuthLayout>
    )
  }

  // 완료 화면
  if (step === "complete") {
    return (
      <AuthLayout>
        <AuthCard className="w-[424px]">
          <div className="flex flex-col items-center gap-6 py-8">
            <div>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="#323232"/>
                <path d="M10 16.5L14 20.5L22 12.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-body-1-regular text-label-normal">
                비밀번호가 변경되었습니다.
              </p>
              <p className="text-body-2-regular text-label-neutral mt-1">
                새로운 비밀번호로 로그인해주세요.
              </p>
            </div>
            <Button
              type="button"
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleGoToLogin}
            >
              로그인
            </Button>
          </div>
        </AuthCard>
      </AuthLayout>
    )
  }

  // 폼 화면
  return (
    <AuthLayout>
      <AuthCard className="w-[424px]">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-title-1-bold text-label-normal">비밀번호 재설정</h1>
            <p className="text-body-1-regular text-label-neutral mt-2">
              새로운 비밀번호를 입력해주세요.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              {/* Password */}
              <TextField
                label="비밀번호"
                type={showPassword ? "text" : "password"}
                placeholder="영문, 숫자, 기호 포함 8~16자"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(null)
                }}
                disabled={isLoading}
                messageType={password && !isPasswordValid(password) ? "error" : undefined}
                message={
                  password && !isPasswordValid(password)
                    ? "영문, 숫자, 기호를 포함하여 8~16자로 입력해주세요."
                    : undefined
                }
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-label-assistive hover:text-label-neutral"
                  >
                    {showPassword ? (
                      <IconVisibilityOff size={24} />
                    ) : (
                      <IconVisibility size={24} />
                    )}
                  </button>
                }
              />

              {/* Password Confirm */}
              <TextField
                label="비밀번호 확인"
                type={showPasswordConfirm ? "text" : "password"}
                placeholder="다시 한번 입력해주세요."
                value={passwordConfirm}
                onChange={(e) => {
                  setPasswordConfirm(e.target.value)
                  setError(null)
                }}
                disabled={isLoading}
                messageType={
                  passwordConfirm && password !== passwordConfirm ? "error" : undefined
                }
                message={
                  passwordConfirm && password !== passwordConfirm
                    ? "비밀번호가 일치하지 않습니다."
                    : undefined
                }
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="text-label-assistive hover:text-label-neutral"
                  >
                    {showPasswordConfirm ? (
                      <IconVisibilityOff size={24} />
                    ) : (
                      <IconVisibility size={24} />
                    )}
                  </button>
                }
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-error-100 border border-error-500 rounded-[8px] px-4 py-3">
                <p className="text-body-2-regular text-error-500">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? "처리 중..." : "완료"}
            </Button>
          </form>
        </div>
      </AuthCard>
    </AuthLayout>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          로딩중...
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  )
}
