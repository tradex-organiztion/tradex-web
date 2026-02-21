"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthLayout, AuthCard } from "@/components/layout"
import { Button, TextField, IconVisibility, IconVisibilityOff, IconXCircle } from "@/components/ui"
import { authApi } from "@/lib/api/auth"
import { useAuthStore } from "@/stores/useAuthStore"

/**
 * 회원가입 페이지
 *
 * Swagger 기준 API: POST /api/auth/signup
 * - email: string (필수)
 * - username: string (필수, 2-100자)
 * - password: string (필수, 최소 8자)
 * - phoneNumber: string (필수, 패턴: ^01[0-9]{8,9}$)
 *
 * SMS 인증 플로우:
 * 1. POST /api/auth/send-sms - 인증번호 발송
 * 2. POST /api/auth/verify-sms - 인증번호 확인
 * 3. POST /api/auth/signup - 회원가입 (인증 완료 후)
 */

type SignupStep = "register" | "complete" | "failed"

export default function SignupPage() {
  const router = useRouter()
  const { login } = useAuthStore()

  const [step, setStep] = useState<SignupStep>("register")

  // Form state
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

  // SMS verification state
  const [isSmsSent, setIsSmsSent] = useState(false)
  const [isSmsVerified, setIsSmsVerified] = useState(false)
  const [smsLoading, setSmsLoading] = useState(false)
  const [smsError, setSmsError] = useState<string | null>(null)
  const [smsTimer, setSmsTimer] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // SMS 타이머 시작
  const startTimer = useCallback(() => {
    setSmsTimer(300) // 5분 = 300초
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setSmsTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  // Loading & Error states
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 휴대폰 번호 유효성 검사 (01로 시작, 10-11자리)
  const isPhoneValid = (phone: string) => {
    const regex = /^01[0-9]{8,9}$/
    return regex.test(phone)
  }

  // 사용자명 유효성 검사 (2-100자)
  const isUsernameValid = (name: string) => {
    return name.trim().length >= 2 && name.trim().length <= 100
  }

  // 비밀번호 유효성 검사 (영문 대문자, 소문자, 숫자, 특수문자 포함 8~16자)
  const isPasswordValid = (pwd: string) => {
    if (pwd.length < 8 || pwd.length > 16) return false
    const hasUpper = /[A-Z]/.test(pwd)
    const hasLower = /[a-z]/.test(pwd)
    const hasNumber = /[0-9]/.test(pwd)
    const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)
    return hasUpper && hasLower && hasNumber && hasSpecial
  }

  // 이메일 유효성 검사
  const isEmailValid = (emailStr: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(emailStr)
  }

  // 인증번호 유효성 검사 (6자리)
  const isCodeValid = (code: string) => {
    return code.length === 6
  }

  const isFormValid =
    username.trim() !== "" &&
    isUsernameValid(username) &&
    email.trim() !== "" &&
    isEmailValid(email) &&
    password.trim() !== "" &&
    isPasswordValid(password) &&
    passwordConfirm.trim() !== "" &&
    password === passwordConfirm &&
    phoneNumber.trim() !== "" &&
    isPhoneValid(phoneNumber) &&
    isSmsVerified

  // SMS 인증번호 발송
  const handleSendSms = async () => {
    if (!isPhoneValid(phoneNumber) || smsLoading) return

    setSmsLoading(true)
    setSmsError(null)

    try {
      await authApi.sendSms({
        phoneNumber,
        type: 'SIGNUP',
      })
      setIsSmsSent(true)
      startTimer()
    } catch (err: unknown) {
      console.warn("Send SMS error:", err)
      if (err && typeof err === "object") {
        const axiosError = err as {
          response?: { data?: { message?: string } }
          message?: string
        }
        if (axiosError.message === "Network Error" || !axiosError.response) {
          setSmsError("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.")
        } else if (axiosError.response?.data?.message) {
          setSmsError(axiosError.response.data.message)
        } else {
          setSmsError("인증번호 발송에 실패했습니다.")
        }
      } else {
        setSmsError("인증번호 발송에 실패했습니다.")
      }
    } finally {
      setSmsLoading(false)
    }
  }

  // SMS 인증번호 확인
  const handleVerifySms = async () => {
    if (!isCodeValid(verificationCode) || smsLoading) return

    setSmsLoading(true)
    setSmsError(null)

    try {
      await authApi.verifySms({
        phoneNumber,
        code: verificationCode,
        type: 'SIGNUP',
      })
      setIsSmsVerified(true)
    } catch (err: unknown) {
      console.warn("Verify SMS error:", err)
      if (err && typeof err === "object") {
        const axiosError = err as {
          response?: { status?: number; data?: { message?: string } }
          message?: string
        }
        if (axiosError.message === "Network Error" || !axiosError.response) {
          setSmsError("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.")
        } else if (axiosError.response?.status === 400) {
          setSmsError("인증번호가 일치하지 않습니다.")
        } else if (axiosError.response?.data?.message) {
          setSmsError(axiosError.response.data.message)
        } else {
          setSmsError("인증번호 확인에 실패했습니다.")
        }
      } else {
        setSmsError("인증번호 확인에 실패했습니다.")
      }
    } finally {
      setSmsLoading(false)
    }
  }

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
        phoneNumber,
      })

      // 회원가입 성공 시 자동 로그인
      login(response.user, response.accessToken, response.refreshToken)

      // 완료 화면으로
      setStep("complete")
    } catch (err: unknown) {
      console.warn("Signup error:", err)
      let errorMsg = "회원가입에 실패했습니다. 다시 시도해주세요."
      if (err && typeof err === "object") {
        const axiosError = err as {
          response?: { status?: number; data?: { message?: string } }
          message?: string
        }
        if (axiosError.message === "Network Error" || !axiosError.response) {
          errorMsg = "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요."
        } else if (axiosError.response?.status === 409) {
          errorMsg = "이미 가입된 이메일입니다."
        } else if (axiosError.response?.data?.message) {
          errorMsg = axiosError.response.data.message
        }
      }
      setError(errorMsg)
      setStep("failed")
    } finally {
      setIsLoading(false)
    }
  }

  // 완료 후 로그인 페이지로 이동
  const handleComplete = () => {
    router.replace("/login")
  }

  // Step 1: Registration Form
  if (step === "register") {
    return (
      <AuthLayout>
        <AuthCard title="회원가입" className="w-[424px]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* 이름 (사용자명) - Figma 순서: 1번째 */}
              <TextField
                label="이름"
                placeholder="이름을 입력해주세요."
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  setError(null)
                }}
                disabled={isLoading}
                messageType={username && !isUsernameValid(username) ? "error" : undefined}
                message={
                  username && !isUsernameValid(username)
                    ? "이름은 2-100자로 입력해주세요."
                    : undefined
                }
                rightElement={
                  username ? (
                    <button
                      type="button"
                      onClick={() => setUsername("")}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="8" fill="currentColor" fillOpacity="0.2"/>
                        <path d="M7.5 7.5L12.5 12.5M12.5 7.5L7.5 12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  ) : undefined
                }
              />

              {/* 휴대폰 번호 - Figma 순서: 2번째 */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <TextField
                    label="휴대폰 번호"
                    placeholder="휴대폰 번호를 입력해주세요."
                    value={phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '')
                      setPhoneNumber(value)
                      setSmsError(null)
                      if (isSmsSent) {
                        setIsSmsSent(false)
                        setIsSmsVerified(false)
                        setVerificationCode("")
                        if (timerRef.current) clearInterval(timerRef.current)
                        setSmsTimer(0)
                      }
                    }}
                    disabled={isLoading || isSmsVerified}
                    messageType={phoneNumber && !isPhoneValid(phoneNumber) ? "error" : undefined}
                    message={
                      phoneNumber && !isPhoneValid(phoneNumber)
                        ? "올바른 휴대폰 번호를 입력해주세요."
                        : undefined
                    }
                    className="flex-1"
                    rightElement={
                      isSmsSent && smsTimer > 0 && !isSmsVerified ? (
                        <span className="text-caption-medium text-label-assistive">{formatTimer(smsTimer)}</span>
                      ) : undefined
                    }
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="mt-[26px] whitespace-nowrap"
                    disabled={!isPhoneValid(phoneNumber) || smsLoading || isSmsVerified}
                    onClick={handleSendSms}
                  >
                    {smsLoading ? "발송 중..." : isSmsSent ? "재발송" : "인증번호"}
                  </Button>
                </div>

                {isSmsSent && !isSmsVerified && (
                  <div className="flex gap-2">
                    <TextField
                      placeholder="인증 번호를 입력해주세요."
                      value={verificationCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6)
                        setVerificationCode(value)
                        setSmsError(null)
                      }}
                      disabled={smsLoading}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={!isCodeValid(verificationCode) || smsLoading}
                      onClick={handleVerifySms}
                    >
                      {smsLoading ? "확인 중..." : "확인"}
                    </Button>
                  </div>
                )}

                {isSmsVerified && (
                  <p className="text-body-2-regular text-success-500">
                    휴대폰 인증이 완료되었습니다.
                  </p>
                )}

                {smsError && (
                  <p className="text-body-2-regular text-error-500">{smsError}</p>
                )}
              </div>

              {/* 이메일 - Figma 순서: 3번째 */}
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
                    ? "유효한 이메일 형식이어야 합니다."
                    : undefined
                }
              />

              {/* 비밀번호 - Figma 순서: 4번째 */}
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
                    ? "영문 대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다."
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

              {/* 비밀번호 확인 */}
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
              <div className="bg-red-100 border border-red-400 rounded-lg px-4 py-3">
                <p className="text-body-2-regular text-red-400">{error}</p>
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
              {isLoading ? "가입 중..." : "다음"}
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

  // Step: Failed
  if (step === "failed") {
    return (
      <AuthLayout>
        <AuthCard title="회원가입" className="w-[424px]">
          <div className="flex flex-col items-center py-8">
            <div className="text-[#FF0015] mb-4">
              <IconXCircle size={48} />
            </div>
            <p className="text-title-2-bold text-label-normal text-center mb-2">
              회원가입에 실패했습니다
            </p>
            <p className="text-body-1-regular text-label-neutral text-center">
              {error || "문제가 발생했습니다. 다시 시도해주세요."}
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="flex-1"
              onClick={() => {
                setStep("register")
                setError(null)
              }}
            >
              다시 시도
            </Button>
            <Button
              type="button"
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={() => router.push("/login")}
            >
              로그인으로
            </Button>
          </div>
        </AuthCard>
      </AuthLayout>
    )
  }

  // Step: Complete
  return (
    <AuthLayout>
      <AuthCard title="회원가입" className="w-[424px]">
        <div className="flex flex-col items-center py-8">
          <div className="mb-4">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="#323232"/>
              <path d="M10 16.5L14 20.5L22 12.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-body-1-regular text-label-neutral text-center">
            회원가입이 완료되었습니다.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleComplete}
        >
          로그인
        </Button>
      </AuthCard>
    </AuthLayout>
  )
}
