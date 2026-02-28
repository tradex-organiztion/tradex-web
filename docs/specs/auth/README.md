# 인증 (Auth) 스펙 문서

> **상태**: `✅ 완료`
> **최종 수정**: 2026-03-01
> **구현 완료일**: 2026-01-25

---

## 1. 개요

이메일/비밀번호 기반 로그인 및 소셜 로그인(Google, Kakao)을 지원합니다. SMS 인증 기반 회원가입, 아이디/비밀번호 찾기, 비밀번호 재설정, 거래소 API 등록(추가 정보 입력) 기능이 모두 구현되어 있습니다.

---

## 2. 구현된 기능

### 2.1 로그인
- ✅ 이메일 + 비밀번호 로그인 (`POST /api/auth/login`)
- ✅ Google OAuth2 소셜 로그인
- ✅ Kakao OAuth2 소셜 로그인
- ✅ JWT 토큰 발급 + 자동 갱신 (axios 인터셉터)
- ✅ 폼 유효성 검사 및 에러 메시지
- ✅ 로그인 실패 케이스 처리

### 2.2 회원가입
- ✅ 이메일 + 비밀번호 + 전화번호 입력 (`POST /api/auth/signup`)
- ✅ SMS 인증 (전송: `POST /api/auth/sms/send`, 확인: `POST /api/auth/sms/verify`)
- ✅ 비밀번호 최소 8자 검증 (Swagger 명세 기준)
- ✅ 회원가입 후 추가 정보 입력 페이지로 이동

### 2.3 추가 정보 입력 (거래소 API 등록)
- ✅ 닉네임 입력 (`POST /api/auth/complete-profile`)
- ✅ 거래소 선택 (Binance / Bybit / Bitget)
- ✅ 거래소 API Key / Secret 입력
- ✅ 완료 후 홈으로 이동

### 2.4 아이디/비밀번호 찾기
- ✅ 이메일 찾기: 전화번호 → SMS 인증 → 이메일 표시
- ✅ 비밀번호 찾기: 이메일 입력 → SMS 인증 → 재설정 링크 발송

### 2.5 비밀번호 재설정
- ✅ URL 토큰 기반 (`/reset-password?token=...`)
- ✅ 새 비밀번호 입력 + 확인 (`POST /api/auth/reset-password`)

### 2.6 로그아웃
- ✅ `POST /api/auth/logout` 호출 + 로컬 상태/토큰 초기화

---

## 3. 화면 목록

| 화면명 | 경로 | 파일 |
|--------|------|------|
| 로그인 | `/login` | `src/app/(auth)/login/page.tsx` |
| 회원가입 | `/signup` | `src/app/(auth)/signup/page.tsx` |
| 추가 정보 입력 | `/additional-info` | `src/app/(auth)/additional-info/page.tsx` |
| 아이디/비밀번호 찾기 | `/find-account` | `src/app/(auth)/find-account/page.tsx` |
| 비밀번호 재설정 | `/reset-password` | `src/app/(auth)/reset-password/page.tsx` |
| OAuth2 리다이렉트 | `/oauth2/redirect` | `src/app/oauth2/redirect/page.tsx` |

---

## 4. API 엔드포인트 (실제 구현)

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/auth/login` | 로그인 |
| POST | `/api/auth/signup` | 회원가입 |
| POST | `/api/auth/logout` | 로그아웃 |
| GET | `/api/auth/me` | 현재 사용자 정보 |
| POST | `/api/auth/complete-profile` | 추가 정보 (거래소 API 등록) |
| POST | `/api/auth/refresh` | 토큰 갱신 |
| POST | `/api/auth/sms/send` | SMS 인증 발송 |
| POST | `/api/auth/sms/verify` | SMS 인증 확인 |
| POST | `/api/auth/forgot-password` | 비밀번호 찾기 |
| POST | `/api/auth/reset-password` | 비밀번호 재설정 |
| GET | `/oauth2/authorization/google` | Google OAuth 시작 |
| GET | `/oauth2/authorization/kakao` | Kakao OAuth 시작 |

---

## 5. 핵심 구현 파일

| 파일 | 역할 |
|------|------|
| `src/lib/api/auth.ts` | 모든 인증 API 함수 |
| `src/lib/api/client.ts` | axios 인스턴스, 토큰 갱신 인터셉터 |
| `src/components/providers/AuthProvider.tsx` | 앱 전역 인증 상태 관리 |
| `src/middleware.ts` | 미인증 사용자 `/login` 리다이렉트 |
| `src/stores/useAuthStore.ts` | Zustand 인증 상태 |

---

## 6. 주요 의사결정

| 항목 | 결정 |
|------|------|
| 소셜 로그인 | Google + Kakao (Apple 미지원) |
| 비밀번호 정책 | 최소 8자 |
| 토큰 방식 | JWT (Access + Refresh, axios 인터셉터 자동 갱신) |
| SMS 인증 | 회원가입 + 아이디/비밀번호 찾기에 적용 |
| 언어 | 한국어 전용 |

---

## 7. 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0 | 2026-03-01 | 실제 구현 기준으로 전면 재작성 |
| 0.1 | 2024-12-22 | 초안 작성 |
