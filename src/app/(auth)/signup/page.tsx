"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthLayout, AuthCard } from "@/components/layout"
import { Button, TextField, IconVisibility, IconVisibilityOff, IconCheckCircle } from "@/components/ui"
import { authApi } from "@/lib/api/auth"
import { useAuthStore } from "@/stores/useAuthStore"

type SignupStep = "register" | "complete"

export default function SignupPage() {
  const router = useRouter()
  const { login } = useAuthStore()

  const [step, setStep] = useState<SignupStep>("register")

  // Form state
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isPhoneVerified, setIsPhoneVerified] = useState(false)
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [timer, setTimer] = useState(0)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

  // Loading & Error states
  const [isLoading, setIsLoading] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [isVerifyingCode, setIsVerifyingCode] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [codeError, setCodeError] = useState<string | null>(null)

  // Timer for verification code
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timer])

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // 인증번호 발송
  const handleSendCode = async () => {
    if (!phone.trim() || isSendingCode) return

    setIsSendingCode(true)
    setPhoneError(null)

    try {
      const response = await authApi.sendVerificationCode(phone)
      if (response.success) {
        setIsCodeSent(true)
        setTimer(269) // 4:29
      }
    } catch (err: unknown) {
      console.error("Send verification code error:", err)
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { data?: { message?: string } } }
        setPhoneError(axiosError.response?.data?.message || "인증번호 발송에 실패했습니다.")
      } else {
        setPhoneError("인증번호 발송에 실패했습니다.")
      }
    } finally {
      setIsSendingCode(false)
    }
  }

  // 인증번호 확인
  const handleVerifyCode = async () => {
    if (!verificationCode.trim() || isVerifyingCode) return

    setIsVerifyingCode(true)
    setCodeError(null)

    try {
      const response = await authApi.verifyCode(phone, verificationCode)
      if (response.success) {
        setIsPhoneVerified(true)
      }
    } catch (err: unknown) {
      console.error("Verify code error:", err)
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { data?: { message?: string } } }
        setCodeError(axiosError.response?.data?.message || "인증번호가 올바르지 않습니다.")
      } else {
        setCodeError("인증번호가 올바르지 않습니다.")
      }
    } finally {
      setIsVerifyingCode(false)
    }
  }

  // 비밀번호 유효성 검사
  const isPasswordValid = (pwd: string) => {
    // 최소 8자, 영문+숫자+특수문자 포함
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/
    return regex.test(pwd)
  }

  const isStep1Valid =
    name.trim() !== "" &&
    isPhoneVerified &&
    email.trim() !== "" &&
    password.trim() !== "" &&
    passwordConfirm.trim() !== "" &&
    password === passwordConfirm &&
    isPasswordValid(password)

  // 회원가입 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isStep1Valid || isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await authApi.signup({
        name,
        email,
        password,
        phone,
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
              {/* Name */}
              <TextField
                label="이름"
                placeholder="이름을 입력해주세요."
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError(null)
                }}
                disabled={isLoading}
              />

              {/* Phone Verification */}
              <div className="space-y-3">
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <TextField
                      label="휴대폰 번호"
                      placeholder="휴대폰 번호를 입력해주세요."
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value)
                        setPhoneError(null)
                      }}
                      disabled={isCodeSent || isLoading}
                      message={phoneError || undefined}
                      messageType={phoneError ? "error" : undefined}
                      rightElement={
                        isCodeSent && timer > 0 ? (
                          <span className="text-caption-medium text-gray-500">
                            {formatTimer(timer)}
                          </span>
                        ) : null
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-[50px] shrink-0"
                    onClick={handleSendCode}
                    disabled={!phone.trim() || isCodeSent || isSendingCode || isLoading}
                  >
                    {isSendingCode ? "발송중..." : "인증번호"}
                  </Button>
                </div>

                {isCodeSent && (
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <TextField
                        placeholder="인증 번호를 입력해주세요."
                        value={verificationCode}
                        onChange={(e) => {
                          setVerificationCode(e.target.value)
                          setCodeError(null)
                        }}
                        disabled={isPhoneVerified || isLoading}
                        messageType={isPhoneVerified ? "success" : codeError ? "error" : undefined}
                        message={
                          isPhoneVerified
                            ? "인증이 완료되었습니다."
                            : codeError || undefined
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      className="h-[50px] w-[80px] shrink-0"
                      onClick={handleVerifyCode}
                      disabled={!verificationCode.trim() || isPhoneVerified || isVerifyingCode || isLoading}
                    >
                      {isVerifyingCode ? "확인중" : "확인"}
                    </Button>
                  </div>
                )}
              </div>

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
              />

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
                    ? "영문, 숫자, 특수문자를 포함하여 8~16자로 입력해주세요."
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
              disabled={!isStep1Valid || isLoading}
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
