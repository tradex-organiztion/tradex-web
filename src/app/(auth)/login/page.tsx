"use client"

import { useState } from "react"
import Link from "next/link"
import { AuthLayout, AuthCard, SocialLoginButtons, AuthDivider } from "@/components/layout"
import { Button, TextField, Checkbox, IconVisibility, IconVisibilityOff } from "@/components/ui"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const isFormValid = email.trim() !== "" && password.trim() !== ""

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement login logic
    console.log({ email, password, rememberMe })
  }

  return (
    <AuthLayout>
      <AuthCard title="로그인">
        {/* Form Section */}
        <div className="flex flex-col gap-6">
          {/* Form Fields */}
          <div className="flex flex-col gap-4">
            <TextField
              label="이메일"
              type="email"
              placeholder="example@tradex.kr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="비밀번호"
              type={showPassword ? "text" : "password"}
              placeholder="내용을 입력하세요"
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
          </div>

          {/* Remember Me & Find Links */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <span className="text-body-1-regular text-gray-800">로그인 유지</span>
            </label>

            <div className="flex items-center gap-2 text-body-1-medium text-gray-600">
              <Link href="/find-account?tab=id" className="hover:text-gray-800 px-0.5 py-1">
                아이디 찾기
              </Link>
              <span className="w-px h-3 bg-gray-200" />
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
            disabled={!isFormValid}
            onClick={handleSubmit}
          >
            로그인
          </Button>
        </div>

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
