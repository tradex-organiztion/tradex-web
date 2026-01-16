import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Auth Middleware
 *
 * 인증이 필요한 페이지와 인증된 사용자가 접근하면 안 되는 페이지를 구분하여 리다이렉트
 *
 * - 보호된 경로 (인증 필요): /home, /trading/*, /chart, /analysis/*, /portfolio/*, /settings/*, /inbox/*
 * - 인증 경로 (인증 시 접근 불가): /login, /signup, /find-account
 * - 공개 경로: /, /oauth2/redirect, /additional-info
 */

// 인증이 필요한 경로들
const protectedPaths = [
  '/home',
  '/trading',
  '/chart',
  '/analysis',
  '/portfolio',
  '/settings',
  '/inbox',
  '/ai',
]

// 인증된 사용자가 접근하면 안 되는 경로들 (로그인/회원가입 페이지)
const authPaths = [
  '/login',
  '/signup',
  '/find-account',
]

// 프로필 미완성 시 접근 가능한 경로
const profileIncompletePaths = [
  '/additional-info',
  '/oauth2/redirect',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 정적 파일, API 경로 등은 무시
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // 정적 파일 (favicon.ico, etc.)
  ) {
    return NextResponse.next()
  }

  // 쿠키 또는 로컬스토리지에서 인증 상태 확인
  // Next.js middleware에서는 localStorage 접근 불가하므로 쿠키 사용 권장
  // 현재는 클라이언트 사이드에서 체크하는 방식으로 구현
  // 서버 사이드 인증 체크가 필요하면 쿠키 기반으로 변경 필요

  // 클라이언트 사이드 인증 상태는 미들웨어에서 확인할 수 없으므로
  // 보호된 페이지는 레이아웃에서 클라이언트 사이드로 체크하도록 함
  // 여기서는 기본적인 라우팅만 처리

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
