"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/stores/useAuthStore"

/**
 * Auth Provider
 *
 * 클라이언트 사이드 인증 체크 및 리다이렉트 처리
 *
 * - 보호된 경로: 인증 필요, 미인증 시 /login으로 리다이렉트
 * - 인증 경로: 인증된 사용자는 /home으로 리다이렉트
 * - 프로필 미완성: /additional-info로 리다이렉트 (보호된 경로 접근 시)
 */

interface AuthProviderProps {
  children: React.ReactNode
}

// 인증이 필요한 경로들
const protectedPaths = [
  "/home",
  "/trading",
  "/chart",
  "/analysis",
  "/portfolio",
  "/settings",
  "/inbox",
  "/ai",
]

// 인증된 사용자가 접근하면 안 되는 경로들
const authPaths = ["/login", "/signup", "/find-account"]

// 프로필 미완성 시 접근 가능한 경로
const allowedWithIncompleteProfile = ["/additional-info", "/oauth2/redirect", "/login", "/signup"]

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, user, isLoading, setLoading, isDemoMode } = useAuthStore()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Zustand persist가 로드되면 isLoading이 false가 됨
    // 초기 로드 시 약간의 딜레이 후 체크
    const checkAuth = () => {
      setLoading(false)
      setIsChecking(false)
    }

    // hydration 완료 후 체크
    const timer = setTimeout(checkAuth, 100)
    return () => clearTimeout(timer)
  }, [setLoading])

  useEffect(() => {
    if (isChecking || isLoading) return

    const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path))
    const isAuthPath = authPaths.some((path) => pathname.startsWith(path))
    const isAllowedWithIncomplete = allowedWithIncompleteProfile.some((path) =>
      pathname.startsWith(path)
    )

    // 데모 모드인 경우 보호된 경로 접근 허용
    if (isDemoMode) {
      // 데모 모드에서 인증 페이지 접근 시 홈으로 리다이렉트
      if (isAuthPath) {
        router.replace("/home")
      }
      return
    }

    // 보호된 경로에 미인증 사용자가 접근
    if (isProtectedPath && !isAuthenticated) {
      router.replace("/login")
      return
    }

    // 인증 경로에 인증된 사용자가 접근
    if (isAuthPath && isAuthenticated) {
      // 프로필 미완성 시 추가정보 페이지로
      if (user && !user.profileCompleted) {
        router.replace("/additional-info")
      } else {
        router.replace("/home")
      }
      return
    }

    // 보호된 경로에 프로필 미완성 사용자가 접근
    if (isProtectedPath && isAuthenticated && user && !user.profileCompleted) {
      if (!isAllowedWithIncomplete) {
        router.replace("/additional-info")
      }
    }
  }, [isChecking, isLoading, isAuthenticated, user, pathname, router, isDemoMode])

  // 초기 로딩 중
  if (isChecking || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}
