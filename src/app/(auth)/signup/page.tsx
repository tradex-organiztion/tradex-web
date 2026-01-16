"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AuthLayout, AuthCard } from "@/components/layout"
import { Button, TextField, IconVisibility, IconVisibilityOff, IconCheckCircle } from "@/components/ui"

type SignupStep = "register" | "exchange" | "complete"

export default function SignupPage() {
  const [step, setStep] = useState<SignupStep>("register")

  // Step 1: Register form state
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

  const handleSendCode = () => {
    if (phone.trim()) {
      setIsCodeSent(true)
      setTimer(269) // 4:29
      // TODO: Send verification code API
    }
  }

  const handleVerifyCode = () => {
    if (verificationCode.trim()) {
      setIsPhoneVerified(true)
      // TODO: Verify code API
    }
  }

  const isStep1Valid =
    name.trim() !== "" &&
    isPhoneVerified &&
    email.trim() !== "" &&
    password.trim() !== "" &&
    passwordConfirm.trim() !== "" &&
    password === passwordConfirm

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isStep1Valid) {
      setStep("exchange")
    }
  }

  const handleSkipExchange = () => {
    setStep("complete")
  }

  const handleComplete = () => {
    // TODO: Navigate to login or home
    window.location.href = "/login"
  }

  // Step 1: Registration Form
  if (step === "register") {
    return (
      <AuthLayout>
        <AuthCard title="회원가입" className="w-[424px]">
          <form onSubmit={handleStep1Submit} className="space-y-6">
            <div className="space-y-4">
              {/* Name */}
              <TextField
                label="이름"
                placeholder="이름을 입력해주세요."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              {/* Phone Verification */}
              <div className="space-y-3">
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <TextField
                      label="휴대폰 번호"
                      placeholder="휴대폰 번호를 입력해주세요."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={isCodeSent}
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
                    disabled={!phone.trim() || isCodeSent}
                  >
                    인증번호
                  </Button>
                </div>

                {isCodeSent && (
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <TextField
                        placeholder="인증 번호를 입력해주세요."
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        disabled={isPhoneVerified}
                        messageType={isPhoneVerified ? "success" : undefined}
                        message={isPhoneVerified ? "인증이 완료되었습니다." : undefined}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      className="h-[50px] w-[80px] shrink-0"
                      onClick={handleVerifyCode}
                      disabled={!verificationCode.trim() || isPhoneVerified}
                    >
                      확인
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
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* Password */}
              <TextField
                label="비밀번호"
                type={showPassword ? "text" : "password"}
                placeholder="영문, 숫자, 기호 포함 8~16자"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                onChange={(e) => setPasswordConfirm(e.target.value)}
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

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={!isStep1Valid}
            >
              다음
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

  // Step 2: Exchange Connection (Optional)
  if (step === "exchange") {
    return (
      <AuthLayout>
        <AuthCard title="거래소" className="w-[424px]">
          <p className="text-center text-body-1-medium text-gray-600 mb-6">
            거래소 API를 연동하면 자동으로 매매 내역을 불러올 수 있습니다.
          </p>

          <div className="space-y-4">
            <TextField
              label="거래소"
              placeholder="거래소를 선택해주세요."
              disabled
            />

            <Button
              type="button"
              variant="secondary"
              className="w-full"
            >
              거래소 추가
            </Button>

            <TextField
              label="별명 (선택)"
              placeholder="거래소 별명을 입력해주세요."
            />
          </div>

          <div className="mt-6 space-y-3">
            <Button
              type="button"
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleSkipExchange}
            >
              다음
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full text-gray-500"
              onClick={handleSkipExchange}
            >
              나중에 하기
            </Button>
          </div>

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

  // Step 3: Complete
  return (
    <AuthLayout>
      <AuthCard title="완료" className="w-[424px]">
        <div className="flex flex-col items-center py-8">
          <div className="text-green-500 mb-4">
            <IconCheckCircle size={32} />
          </div>
          <p className="text-body-1-regular text-gray-800">
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
          로그인하기
        </Button>
      </AuthCard>
    </AuthLayout>
  )
}
