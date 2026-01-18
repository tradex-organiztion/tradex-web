"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthLayout, AuthCard } from "@/components/layout"
import { Button, TextField, IconVisibility, IconVisibilityOff, IconCheckCircle } from "@/components/ui"
import { authApi } from "@/lib/api/auth"
import { useAuthStore } from "@/stores/useAuthStore"

/**
 * 회원가입 페이지
 *
 * Swagger 기준 API: POST /api/auth/signup
 * - email: string (필수)
 * - username: string (필수, 2-100자)
 * - password: string (필수, 최소 8자)
 *
 * 참고: 휴대폰 인증 API가 Swagger에 존재하지 않아 제외됨
 */

type SignupStep = "register" | "complete"

export default function SignupPage() {
  const router = useRouter()
  const { login } = useAuthStore()

  const [step, setStep] = useState<SignupStep>("register")

  // Form state (Swagger 스펙 기준)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

  // Loading & Error states
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 사용자명 유효성 검사 (2-100자)
  const isUsernameValid = (name: string) => {
    return name.trim().length >= 2 && name.trim().length <= 100
  }

  // 비밀번호 유효성 검사 (최소 8자)
  const isPasswordValid = (pwd: string) => {
    return pwd.length >= 8
  }

  // 이메일 유효성 검사
  const isEmailValid = (emailStr: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(emailStr)
  }

  const isFormValid =
    username.trim() !== "" &&
    isUsernameValid(username) &&
    email.trim() !== "" &&
    isEmailValid(email) &&
    password.trim() !== "" &&
    isPasswordValid(password) &&
    passwordConfirm.trim() !== "" &&
    password === passwordConfirm

  // 회원가입 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid || isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await authApi.signup({
        username,
        email,
        password,
      })

      // 회원가입 성공 시 자동 로그인
      login(response.user, response.accessToken, response.refreshToken)

      // 완료 화면으로
      setStep("complete")
    } catch (err: unknown) {
      console.error("Signup error:", err)
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { status?: number; data?: { message?: string } } }
        if (axiosError.response?.status === 409) {
          setError("이미 가입된 이메일입니다.")
        } else if (axiosError.response?.data?.message) {
          setError(axiosError.response.data.message)
        } else {
          setError("회원가입에 실패했습니다. 다시 시도해주세요.")
        }
      } else {
        setError("회원가입에 실패했습니다. 다시 시도해주세요.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // 완료 후 홈으로 이동
  const handleComplete = () => {
    router.replace("/home")
  }

  // Step 1: Registration Form
  if (step === "register") {
    return (
      <AuthLayout>
        <AuthCard title="회원가입" className="w-[424px]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Username (사용자명) */}
              <TextField
                label="사용자명"
                placeholder="사용자명을 입력해주세요. (2-100자)"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  setError(null)
                }}
                disabled={isLoading}
                messageType={username && !isUsernameValid(username) ? "error" : undefined}
                message={
                  username && !isUsernameValid(username)
                    ? "사용자명은 2-100자로 입력해주세요."
                    : undefined
                }
              />

              {/* Email */}
              <TextField
                label="이메일"
                type="email"
                placeholder="이메일을 입력해주세요."
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError(null)
                }}
                disabled={isLoading}
                messageType={email && !isEmailValid(email) ? "error" : undefined}
                message={
                  email && !isEmailValid(email)
                    ? "올바른 이메일 형식을 입력해주세요."
                    : undefined
                }
              />

              {/* Password */}
              <TextField
                label="비밀번호"
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호를 입력해주세요. (최소 8자)"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(null)
                }}
                disabled={isLoading}
                messageType={password && !isPasswordValid(password) ? "error" : undefined}
                message={
                  password && !isPasswordValid(password)
                    ? "비밀번호는 최소 8자 이상이어야 합니다."
                    : undefined
                }
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
                    className="text-gray-300 hover:text-gray-500"
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
              <div className="bg-[#FFF9F9] border border-[#FF0015] rounded-[8px] px-4 py-3">
                <p className="text-body-2-regular text-[#FF0015]">{error}</p>
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
              {isLoading ? "가입 중..." : "회원가입"}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 flex items-center justify-center gap-2 text-body-1-regular text-gray-600">
            <span>이미 회원이신가요?</span>
            <Link
              href="/login"
              className="text-body-1-medium text-gray-600 hover:text-gray-800"
            >
              로그인
            </Link>
          </div>
        </AuthCard>
      </AuthLayout>
    )
  }

  // Step 2: Complete
  return (
    <AuthLayout>
      <AuthCard title="완료" className="w-[424px]">
        <div className="flex flex-col items-center py-8">
          <div className="text-[#13C34E] mb-4">
            <IconCheckCircle size={48} />
          </div>
          <p className="text-body-1-regular text-gray-800 text-center">
            회원가입이 완료되었습니다.
            <br />
            Tradex와 함께 스마트한 트레이딩을 시작하세요!
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleComplete}
        >
          시작하기
        </Button>
      </AuthCard>
    </AuthLayout>
  )
}
