"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/useAuthStore"
import { authApi } from "@/lib/api/auth"

/**
 * OAuth2 리다이렉트 페이지
 *
 * 소셜 로그인 성공 후 백엔드에서 이 페이지로 리다이렉트됩니다.
 *
 * Query Parameters:
 * - accessToken: JWT 액세스 토큰
 * - refreshToken: JWT 리프레시 토큰
 * - profileCompleted: 프로필 완성 여부 ("true" | "false")
 *
 * Flow:
 * 1. URL에서 토큰과 profileCompleted 파라미터 추출
 * 2. Zustand store에 토큰 저장
 * 3. authApi.me()로 사용자 정보 조회 및 저장
 * 4. profileCompleted에 따라 라우팅:
 *    - false → /additional-info (추가 정보 입력)
 *    - true → /home (메인 페이지)
 */

// 로딩 화면 컴포넌트
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#F4F5F6] flex items-center justify-center">
      <div className="w-[424px] rounded-[12px] bg-[#FFFFFF] p-8 shadow-emphasize flex flex-col items-center gap-6">
        {/* Loading Spinner */}
        <div className="w-12 h-12 border-4 border-[#E6E8EA] border-t-[#131416] rounded-full animate-spin" />
        <p className="text-body-1-medium text-[#464C53]">
          로그인 처리 중...
        </p>
      </div>
    </div>
  )
}

// OAuth 콜백 처리 컴포넌트 (useSearchParams 사용)
function OAuth2RedirectHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { setTokens, setUser } = useAuthStore()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // URL에서 파라미터 추출
      const accessToken = searchParams.get("accessToken")
      const refreshToken = searchParams.get("refreshToken")
      const profileCompletedParam = searchParams.get("profileCompleted")

      // 에러 파라미터 확인
      const errorParam = searchParams.get("error")
      if (errorParam) {
        setError(decodeURIComponent(errorParam))
        return
      }

      // 토큰 유효성 검사
      if (!accessToken || !refreshToken) {
        setError("로그인 정보를 받아오지 못했습니다. 다시 시도해주세요.")
        return
      }

      // profileCompleted 파싱
      const profileCompleted = profileCompletedParam === "true"

      // 토큰 저장
      setTokens(accessToken, refreshToken, profileCompleted)

      // 사용자 정보 조회 (authApi.me)
      try {
        const userInfo = await authApi.me()
        setUser(userInfo)
      } catch (err) {
        console.error("Failed to fetch user info:", err)
        // 사용자 정보 조회 실패해도 로그인은 진행
      }

      // 라우팅
      if (profileCompleted) {
        // 기존 사용자 → 메인 페이지
        router.replace("/home")
      } else {
        // 신규 사용자 → 추가 정보 입력 페이지
        router.replace("/additional-info")
      }
    }

    handleOAuthCallback()
  }, [searchParams, router, setTokens, setUser])

  // 에러 화면
  if (error) {
    return (
      <div className="min-h-screen bg-[#F4F5F6] flex items-center justify-center">
        <div className="w-[424px] rounded-[12px] bg-[#FFFFFF] p-8 shadow-emphasize flex flex-col items-center gap-6">
          <div className="text-[#FF0015] text-[48px]">!</div>
          <h1 className="text-title-2-bold !text-[#131416]">로그인 실패</h1>
          <p className="text-body-1-regular text-[#464C53] text-center">
            {error}
          </p>
          <button
            onClick={() => router.replace("/login")}
            className="w-full h-[54px] bg-[#131416] !text-[#FFFFFF] rounded-[8px] text-body-1-medium"
          >
            로그인 페이지로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  // 로딩 화면
  return <LoadingScreen />
}

// 메인 페이지 컴포넌트 (Suspense로 감싸기)
export default function OAuth2RedirectPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <OAuth2RedirectHandler />
    </Suspense>
  )
}
