"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { Button } from "@/components/ui"
import { cn } from "@/lib/utils"

/**
 * Auth Layout - Figma Design에 맞춘 인증 페이지 레이아웃
 * Figma: https://www.figma.com/design/bIuxiR3Mqy0PfLkxIQv4Oa
 *
 * 회색 배경(#F4F5F6)에 중앙에 흰색 카드 형태
 */

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F4F5F6]">
      {/* Header */}
      <header className="bg-[#FFFFFF] px-[100px] py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span
              className="text-[22px] font-semibold"
              style={{
                backgroundImage: "linear-gradient(156deg, #000 0%, #323232 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Tradex
            </span>
          </Link>

          {/* Header Buttons */}
          <div className="flex items-center gap-4">
            <Button variant="secondary" size="md">
              데모 체험하기
            </Button>
            <Button variant="primary" size="md">
              무료로 시작하기
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex min-h-[calc(100vh-70px)] items-center justify-center px-4 py-8">
        {children}
      </main>
    </div>
  )
}

/**
 * Auth Card - 인증 폼을 감싸는 카드 컴포넌트
 * Figma 기준: padding 32px, gap 32px, border-radius 12px
 */
interface AuthCardProps {
  children: ReactNode
  title?: string
  className?: string
}

export function AuthCard({ children, title, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        "w-[424px] rounded-[12px] bg-[#FFFFFF] p-8 shadow-emphasize flex flex-col gap-8",
        className
      )}
    >
      {title && (
        <h1 className="text-center text-title-1-bold !text-[#131416]">
          {title}
        </h1>
      )}
      {children}
    </div>
  )
}

/**
 * Social Login Buttons
 */
export function SocialLoginButtons() {
  return (
    <div className="flex items-center justify-center gap-4">
      {/* Kakao */}
      <button
        type="button"
        className="flex size-[54px] items-center justify-center rounded-full bg-[#FEE500] transition-opacity hover:opacity-90"
        aria-label="카카오로 로그인"
      >
        <KakaoIcon />
      </button>

      {/* Naver */}
      <button
        type="button"
        className="flex size-[54px] items-center justify-center rounded-full bg-[#03C75A] transition-opacity hover:opacity-90"
        aria-label="네이버로 로그인"
      >
        <NaverIcon />
      </button>

      {/* Google */}
      <button
        type="button"
        className="flex size-[54px] items-center justify-center rounded-full border border-gray-200 bg-gray-0 transition-opacity hover:opacity-90"
        aria-label="구글로 로그인"
      >
        <GoogleIcon />
      </button>
    </div>
  )
}

/**
 * Divider with OR text
 */
export function AuthDivider() {
  return (
    <div className="flex items-center gap-4">
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-body-2-regular text-gray-400">OR</span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  )
}

// Social Login Icons
function KakaoIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 2C5.477 2 1 5.463 1 9.714c0 2.747 1.845 5.153 4.608 6.51l-1.172 4.31a.357.357 0 0 0 .54.4l4.896-3.21c.367.034.74.053 1.128.053 5.523 0 10-3.464 10-7.714S16.523 2 11 2Z"
        fill="#000"
      />
    </svg>
  )
}

function NaverIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14.3 11.66L7.45 2H2v18h5.7V10.34L14.55 20H20V2h-5.7v9.66Z"
        fill="#fff"
      />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20.64 11.205c0-.639-.057-1.252-.164-1.841H11v3.481h5.396a4.611 4.611 0 0 1-2.002 3.026v2.515h3.242c1.897-1.747 2.991-4.319 2.991-7.181Z"
        fill="#4285F4"
      />
      <path
        d="M11 21c2.7 0 4.964-.896 6.618-2.423l-3.232-2.515c-.896.6-2.042.955-3.386.955-2.604 0-4.808-1.759-5.595-4.123H2.064v2.596A9.996 9.996 0 0 0 11 21Z"
        fill="#34A853"
      />
      <path
        d="M5.405 12.894a5.997 5.997 0 0 1 0-3.788V6.51H2.064a9.996 9.996 0 0 0 0 8.98l3.341-2.596Z"
        fill="#FBBC05"
      />
      <path
        d="M11 4.983c1.468 0 2.786.505 3.823 1.496l2.868-2.868C15.959 1.99 13.695 1 11 1 7.086 1 3.655 3.24 2.064 6.51l3.341 2.596C6.192 6.742 8.396 4.983 11 4.983Z"
        fill="#EA4335"
      />
    </svg>
  )
}
