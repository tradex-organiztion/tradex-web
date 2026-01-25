"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { AuthLayout, AuthCard } from "@/components/layout"
import { Button, TextField, Tabs, TabsList, TabsTrigger, TabsContent, IconCheckCircle } from "@/components/ui"
import { authApi } from "@/lib/api/auth"

/**
 * 아이디/비밀번호 찾기 페이지
 *
 * API:
 * - 아이디 찾기: POST /api/auth/send-sms, POST /api/auth/verify-sms, POST /api/auth/find-email
 * - 비밀번호 찾기: POST /api/auth/forgot-password
 */

type FindStep = "form" | "complete"
type TabType = "id" | "password"

function FindAccountContent() {
  const searchParams = useSearchParams()
  const defaultTab = (searchParams.get("tab") as TabType) || "id"

  const [activeTab, setActiveTab] = useState<TabType>(defaultTab)
  const [step, setStep] = useState<FindStep>("form")
  const [foundEmail, setFoundEmail] = useState("")

  // Find ID form state
  const [idPhone, setIdPhone] = useState("")
  const [idVerificationCode, setIdVerificationCode] = useState("")
  const [isIdCodeSent, setIsIdCodeSent] = useState(false)
  const [isIdVerified, setIsIdVerified] = useState(false)
  const [idTimer, setIdTimer] = useState(0)
  const [idLoading, setIdLoading] = useState(false)
  const [idError, setIdError] = useState<string | null>(null)

  // Find Password form state
  const [pwEmail, setPwEmail] = useState("")
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState<string | null>(null)

  // 휴대폰 번호 유효성 검사
  const isPhoneValid = (phone: string) => {
    const regex = /^01[0-9]{8,9}$/
    return regex.test(phone)
  }

  // 이메일 유효성 검사
  const isEmailValid = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  // Timer for ID verification
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (idTimer > 0) {
      interval = setInterval(() => {
        setIdTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [idTimer])

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Reset form when tab changes
  useEffect(() => {
    setStep("form")
    setIdPhone("")
    setIdVerificationCode("")
    setIsIdCodeSent(false)
    setIsIdVerified(false)
    setIdTimer(0)
    setIdError(null)
    setPwEmail("")
    setPwError(null)
    setFoundEmail("")
  }, [activeTab])

  // Find ID handlers - 인증번호 발송
  const handleIdSendCode = async () => {
    if (!isPhoneValid(idPhone) || idLoading) return

    setIdLoading(true)
    setIdError(null)

    try {
      await authApi.sendSms({
        phoneNumber: idPhone,
        type: 'FIND_EMAIL',
      })
      setIsIdCodeSent(true)
      setIdTimer(180) // 3분
    } catch (err: unknown) {
      console.warn("Send SMS error:", err)
      if (err && typeof err === "object") {
        const axiosError = err as {
          response?: { data?: { message?: string } }
          message?: string
        }
        if (axiosError.message === "Network Error" || !axiosError.response) {
          setIdError("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.")
        } else if (axiosError.response?.data?.message) {
          setIdError(axiosError.response.data.message)
        } else {
          setIdError("인증번호 발송에 실패했습니다.")
        }
      } else {
        setIdError("인증번호 발송에 실패했습니다.")
      }
    } finally {
      setIdLoading(false)
    }
  }

  // Find ID handlers - 인증번호 확인
  const handleIdVerifyCode = async () => {
    if (!idVerificationCode.trim() || idLoading) return

    setIdLoading(true)
    setIdError(null)

    try {
      await authApi.verifySms({
        phoneNumber: idPhone,
        code: idVerificationCode,
        type: 'FIND_EMAIL',
      })
      setIsIdVerified(true)
    } catch (err: unknown) {
      console.warn("Verify SMS error:", err)
      if (err && typeof err === "object") {
        const axiosError = err as {
          response?: { status?: number; data?: { message?: string } }
          message?: string
        }
        if (axiosError.message === "Network Error" || !axiosError.response) {
          setIdError("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.")
        } else if (axiosError.response?.status === 400) {
          setIdError("인증번호가 일치하지 않습니다.")
        } else if (axiosError.response?.data?.message) {
          setIdError(axiosError.response.data.message)
        } else {
          setIdError("인증번호 확인에 실패했습니다.")
        }
      } else {
        setIdError("인증번호 확인에 실패했습니다.")
      }
    } finally {
      setIdLoading(false)
    }
  }

  // Find ID handlers - 이메일 찾기
  const handleFindIdSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isIdVerified || idLoading) return

    setIdLoading(true)
    setIdError(null)

    try {
      const response = await authApi.findEmail({
        phoneNumber: idPhone,
      })

      if (response.maskedEmail) {
        setFoundEmail(response.maskedEmail)
        setStep("complete")
      } else {
        setIdError("해당 휴대폰 번호로 가입된 계정이 없습니다.")
      }
    } catch (err: unknown) {
      console.warn("Find email error:", err)
      if (err && typeof err === "object") {
        const axiosError = err as {
          response?: { status?: number; data?: { message?: string } }
          message?: string
        }
        if (axiosError.message === "Network Error" || !axiosError.response) {
          setIdError("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.")
        } else if (axiosError.response?.status === 404) {
          setIdError("해당 휴대폰 번호로 가입된 계정이 없습니다.")
        } else if (axiosError.response?.data?.message) {
          setIdError(axiosError.response.data.message)
        } else {
          setIdError("이메일 찾기에 실패했습니다.")
        }
      } else {
        setIdError("이메일 찾기에 실패했습니다.")
      }
    } finally {
      setIdLoading(false)
    }
  }

  // Find Password handlers - 비밀번호 재설정 이메일 발송
  const handleFindPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isEmailValid(pwEmail) || pwLoading) return

    setPwLoading(true)
    setPwError(null)

    try {
      await authApi.forgotPassword({
        email: pwEmail,
      })
      setStep("complete")
    } catch (err: unknown) {
      console.warn("Forgot password error:", err)
      if (err && typeof err === "object") {
        const axiosError = err as {
          response?: { status?: number; data?: { message?: string } }
          message?: string
        }
        if (axiosError.message === "Network Error" || !axiosError.response) {
          setPwError("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.")
        } else if (axiosError.response?.status === 404) {
          setPwError("등록되지 않은 이메일입니다.")
        } else if (axiosError.response?.data?.message) {
          setPwError(axiosError.response.data.message)
        } else {
          setPwError("이메일 발송에 실패했습니다.")
        }
      } else {
        setPwError("이메일 발송에 실패했습니다.")
      }
    } finally {
      setPwLoading(false)
    }
  }

  const handleGoToLogin = () => {
    window.location.href = "/login"
  }

  const isIdFormValid = isIdVerified
  const isPwFormValid = pwEmail.trim() !== "" && isEmailValid(pwEmail)

  // Complete state - Find ID
  if (step === "complete" && activeTab === "id") {
    return (
      <AuthLayout>
        <AuthCard>
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)}>
            <TabsList>
              <TabsTrigger value="id">아이디 찾기</TabsTrigger>
              <TabsTrigger value="password">비밀번호 찾기</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Result Content */}
          <div className="flex flex-col items-center gap-6 w-[360px] mx-auto">
            <div className="flex flex-col items-center py-4">
              <div className="text-[#13C34E] mb-4">
                <IconCheckCircle size={32} />
              </div>
              <p className="text-body-1-regular text-[#131416] text-center mb-2">
                아래 이메일 주소로 가입되어 있어요.
              </p>
              <p className="text-title-2-bold text-[#131416]">
                {foundEmail}
              </p>
            </div>

            <Button
              type="button"
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleGoToLogin}
            >
              로그인하기
            </Button>
          </div>
        </AuthCard>
      </AuthLayout>
    )
  }

  // Complete state - Find Password
  if (step === "complete" && activeTab === "password") {
    return (
      <AuthLayout>
        <AuthCard>
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)}>
            <TabsList>
              <TabsTrigger value="id">아이디 찾기</TabsTrigger>
              <TabsTrigger value="password">비밀번호 찾기</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Result Content */}
          <div className="flex flex-col items-center gap-6 w-[360px] mx-auto">
            <div className="flex flex-col items-center py-4">
              <div className="text-[#13C34E] mb-4">
                <IconCheckCircle size={32} />
              </div>
              <p className="text-body-1-regular text-[#131416]">
                메일이 전송되었습니다.
              </p>
            </div>

            <Button
              type="button"
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleGoToLogin}
            >
              로그인하기
            </Button>
          </div>
        </AuthCard>
      </AuthLayout>
    )
  }

  // Form state
  return (
    <AuthLayout>
      <AuthCard>
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)}>
          <TabsList>
            <TabsTrigger value="id">아이디 찾기</TabsTrigger>
            <TabsTrigger value="password">비밀번호 찾기</TabsTrigger>
          </TabsList>

          {/* Find ID Tab */}
          <TabsContent value="id" className="pt-8">
            <form onSubmit={handleFindIdSubmit} className="flex flex-col gap-6 w-[360px] mx-auto">
              {/* Form Fields */}
              <div className="flex flex-col gap-4">
                {/* Phone Verification */}
                <div className="flex flex-col gap-3">
                  {/* Phone Input Row */}
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <TextField
                        label="휴대폰 번호"
                        placeholder="01012345678"
                        value={idPhone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '')
                          setIdPhone(value)
                          setIdError(null)
                          // 번호 변경 시 인증 상태 초기화
                          if (isIdCodeSent) {
                            setIsIdCodeSent(false)
                            setIsIdVerified(false)
                            setIdVerificationCode("")
                            setIdTimer(0)
                          }
                        }}
                        disabled={idLoading || isIdVerified}
                        rightElement={
                          isIdCodeSent && idTimer > 0 && !isIdVerified ? (
                            <span className="text-caption-medium text-[#58616A]">
                              {formatTimer(idTimer)}
                            </span>
                          ) : null
                        }
                        messageType={idPhone && !isPhoneValid(idPhone) ? "error" : undefined}
                        message={idPhone && !isPhoneValid(idPhone) ? "올바른 휴대폰 번호를 입력해주세요." : undefined}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      className="h-[50px] shrink-0"
                      onClick={handleIdSendCode}
                      disabled={!isPhoneValid(idPhone) || idLoading || isIdVerified}
                    >
                      {idLoading && !isIdCodeSent ? "발송 중..." : isIdCodeSent ? "재발송" : "인증번호"}
                    </Button>
                  </div>

                  {/* Verification Code Row */}
                  {isIdCodeSent && (
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <TextField
                          placeholder="인증 번호를 입력해주세요."
                          value={idVerificationCode}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6)
                            setIdVerificationCode(value)
                            setIdError(null)
                          }}
                          disabled={idLoading || isIdVerified}
                          messageType={isIdVerified ? "success" : undefined}
                          message={isIdVerified ? "인증이 완료되었습니다." : undefined}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-[50px] w-[80px] shrink-0"
                        onClick={handleIdVerifyCode}
                        disabled={!idVerificationCode.trim() || idLoading || isIdVerified}
                      >
                        {idLoading && isIdCodeSent && !isIdVerified ? "확인 중..." : "확인"}
                      </Button>
                    </div>
                  )}

                  {/* Error message */}
                  {idError && (
                    <p className="text-body-2-regular text-error-500">{idError}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={!isIdFormValid || idLoading}
              >
                {idLoading ? "처리 중..." : "완료"}
              </Button>
            </form>
          </TabsContent>

          {/* Find Password Tab */}
          <TabsContent value="password" className="pt-8">
            {/* Description */}
            <p className="text-body-1-medium text-[#464C53] text-center mb-8">
              가입하신 이메일을 입력하시면,<br />
              비밀번호 변경 메일을 발송해드립니다.
            </p>

            <form onSubmit={handleFindPasswordSubmit} className="flex flex-col gap-6 w-[360px] mx-auto">
              {/* Email Input */}
              <TextField
                label="이메일"
                type="email"
                placeholder="이메일을 입력해주세요."
                value={pwEmail}
                onChange={(e) => {
                  setPwEmail(e.target.value)
                  setPwError(null)
                }}
                disabled={pwLoading}
                messageType={pwEmail && !isEmailValid(pwEmail) ? "error" : (pwError ? "error" : undefined)}
                message={pwEmail && !isEmailValid(pwEmail) ? "올바른 이메일 형식을 입력해주세요." : (pwError || undefined)}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={!isPwFormValid || pwLoading}
              >
                {pwLoading ? "발송 중..." : "완료"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </AuthCard>
    </AuthLayout>
  )
}

export default function FindAccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F4F5F6] flex items-center justify-center">로딩중...</div>}>
      <FindAccountContent />
    </Suspense>
  )
}
