"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { AuthLayout, AuthCard } from "@/components/layout"
import { Button, TextField, Tabs, TabsList, TabsTrigger, TabsContent, IconCheckCircle } from "@/components/ui"

/**
 * 아이디/비밀번호 찾기 페이지
 * Figma: https://www.figma.com/design/bIuxiR3Mqy0PfLkxIQv4Oa
 * - 아이디 찾기: node-id=1498-2398
 * - 비밀번호 찾기: node-id=1498-2446
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
  const [idName, setIdName] = useState("")
  const [idPhone, setIdPhone] = useState("")
  const [idVerificationCode, setIdVerificationCode] = useState("")
  const [isIdCodeSent, setIsIdCodeSent] = useState(false)
  const [isIdVerified, setIsIdVerified] = useState(false)
  const [idTimer, setIdTimer] = useState(0)

  // Find Password form state
  const [pwEmail, setPwEmail] = useState("")

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
    setIdName("")
    setIdPhone("")
    setIdVerificationCode("")
    setIsIdCodeSent(false)
    setIsIdVerified(false)
    setIdTimer(0)
    setPwEmail("")
    setFoundEmail("")
  }, [activeTab])

  // Find ID handlers
  const handleIdSendCode = () => {
    if (idPhone.trim()) {
      setIsIdCodeSent(true)
      setIdTimer(269)
      // TODO: Send verification code API
    }
  }

  const handleIdVerifyCode = () => {
    if (idVerificationCode.trim()) {
      setIsIdVerified(true)
      // TODO: Verify code API
    }
  }

  const handleFindIdSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (idName.trim() && isIdVerified) {
      // TODO: Find ID API
      setFoundEmail("example@tradex.kr") // Mock found email
      setStep("complete")
    }
  }

  // Find Password handlers
  const handleFindPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pwEmail.trim()) {
      // TODO: Send password reset email API
      setStep("complete")
    }
  }

  const handleGoToLogin = () => {
    window.location.href = "/login"
  }

  const isIdFormValid = idName.trim() !== "" && isIdVerified
  const isPwFormValid = pwEmail.trim() !== ""

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
                {/* Name */}
                <TextField
                  label="이름"
                  placeholder="이름을 입력해주세요."
                  value={idName}
                  onChange={(e) => setIdName(e.target.value)}
                />

                {/* Phone Verification */}
                <div className="flex flex-col gap-3">
                  {/* Phone Input Row */}
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <TextField
                        label="휴대폰 번호"
                        placeholder="휴대폰 번호를 입력해주세요."
                        value={idPhone}
                        onChange={(e) => setIdPhone(e.target.value)}
                        disabled={isIdCodeSent}
                        rightElement={
                          isIdCodeSent && idTimer > 0 ? (
                            <span className="text-caption-medium text-[#58616A]">
                              {formatTimer(idTimer)}
                            </span>
                          ) : null
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      className="h-[50px] shrink-0"
                      onClick={handleIdSendCode}
                      disabled={!idPhone.trim() || isIdCodeSent}
                    >
                      인증번호
                    </Button>
                  </div>

                  {/* Verification Code Row */}
                  {isIdCodeSent && (
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <TextField
                          placeholder="인증 번호를 입력해주세요."
                          value={idVerificationCode}
                          onChange={(e) => setIdVerificationCode(e.target.value)}
                          disabled={isIdVerified}
                          messageType={isIdVerified ? "success" : undefined}
                          message={isIdVerified ? "인증이 완료되었습니다." : undefined}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-[50px] w-[80px] shrink-0"
                        onClick={handleIdVerifyCode}
                        disabled={!idVerificationCode.trim() || isIdVerified}
                      >
                        확인
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={!isIdFormValid}
              >
                완료
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
                onChange={(e) => setPwEmail(e.target.value)}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={!isPwFormValid}
              >
                완료
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
