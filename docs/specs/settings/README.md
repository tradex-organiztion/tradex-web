# 설정 (Settings) 스펙 문서

> **상태**: `✅ 완료`
> **최종 수정**: 2026-03-01
> **구현 완료일**: 2026-02-28

---

## 1. 개요

`SettingsModal` 컴포넌트 내 4개 탭(계정/기본 설정/알림/구독)으로 구성된 설정 화면입니다. `/settings/*` 경로는 각각 해당 탭을 열어주는 래퍼 페이지입니다.

---

## 2. 구현된 기능

### 2.1 계정 설정 (Account 탭)
- ✅ 프로필 조회: 닉네임, 이메일 (조회 전용 — 수정 UI 없음)
- ✅ 비밀번호 변경 (`POST /api/users/change-password`, SMS 인증 포함)
- ✅ 거래소 API 키 CRUD (Binance, Bybit, Bitget)
  - 연결 / 수정 / 삭제 (`exchangeApi` 9개 엔드포인트)
- ✅ 로그아웃 버튼

### 2.2 기본 설정 (Preferences 탭)
- ✅ 테마 토글 (라이트/다크) — TradingView 차트 테마 연동 포함
- ✅ 언어 설정 (한국어 전용, UI 표시만)

### 2.3 알림 설정 (Notifications 탭)
- ✅ 알림 유형별 ON/OFF 토글 (앱 내 알림)
- ✅ 브라우저 푸시 알림: 미구현 (범위 외)

### 2.4 구독 설정 (Subscription 탭)
- ✅ 현재 구독 플랜 표시 (`subscriptionApi.getMySubscription()`)
- ✅ 전체 플랜 목록 (`subscriptionApi.getPlans()`)
- ✅ 결제 수단 표시 (카드사, 카드번호 마스킹)
- ✅ 결제 내역 (`subscriptionApi.getPaymentHistory()`)
- ✅ 구독 해지 모달 (`subscriptionApi.cancelSubscription()`)
- ✅ 플랜 변경 (`subscriptionApi.changePlan()`)
- ✅ 결제 수단 추가/변경 → 토스페이먼츠 빌링 플로우
  - `requestBillingAuth()` → 빌링 성공/실패 콜백 페이지
  - 성공: `subscriptionApi.issueBillingKey()`

---

## 3. 화면 목록

| 화면명 | 경로 | 파일 |
|--------|------|------|
| 계정 설정 | `/settings/account` | `src/app/(main)/settings/account/page.tsx` |
| 기본 설정 | `/settings/preferences` | `src/app/(main)/settings/preferences/page.tsx` |
| 알림 설정 | `/settings/notifications` | `src/app/(main)/settings/notifications/page.tsx` |
| 구독 설정 | `/settings/subscription` | `src/app/(main)/settings/subscription/page.tsx` |
| 빌링 성공 | `/billing/success` | `src/app/(main)/billing/success/page.tsx` |
| 빌링 실패 | `/billing/fail` | `src/app/(main)/billing/fail/page.tsx` |

---

## 4. API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/auth/me` | 사용자 프로필 조회 |
| POST | `/api/users/change-password` | 비밀번호 변경 (SMS 인증) |
| GET | `/api/exchanges` | 거래소 API 키 목록 |
| POST | `/api/exchanges` | 거래소 API 키 등록 |
| PUT | `/api/exchanges/{id}` | 거래소 API 키 수정 |
| DELETE | `/api/exchanges/{id}` | 거래소 API 키 삭제 |
| GET | `/api/subscriptions/my` | 내 구독 정보 |
| GET | `/api/subscriptions/plans` | 플랜 목록 |
| POST | `/api/subscriptions/billing-key` | 빌링키 발급 |
| POST | `/api/subscriptions/change-plan` | 플랜 변경 |
| POST | `/api/subscriptions/cancel` | 구독 해지 |
| GET | `/api/subscriptions/payment-history` | 결제 내역 |
| POST | `/api/subscriptions/change-payment` | 결제 수단 변경 |

---

## 5. 핵심 구현 파일

| 파일 | 역할 |
|------|------|
| `src/components/settings/SettingsModal.tsx` | 전체 설정 모달 (4개 탭) |
| `src/lib/api/subscription.ts` | `subscriptionApi` (7개 엔드포인트) |
| `src/lib/api/exchange.ts` | `exchangeApi` (9개 엔드포인트) |
| `src/lib/api/user.ts` | `userApi.changePassword()` |
| `src/app/(main)/billing/success/page.tsx` | 토스페이먼츠 빌링 성공 콜백 |
| `src/app/(main)/billing/fail/page.tsx` | 토스페이먼츠 빌링 실패 콜백 |

---

## 6. 주요 의사결정

| 항목 | 결정 |
|------|------|
| 닉네임/프로필 이미지 수정 | 미구현 (조회 전용 확정, 백엔드 API 없음) |
| 결제 시스템 | 토스페이먼츠 (빌링키 방식 정기결제) |
| 구독 플랜 | Free / Pro / Enterprise |
| 알림 채널 | 앱 내 알림만 (푸시/이메일 미지원) |
| 지원 언어 | 한국어 전용 (i18n 미적용) |

---

## 7. 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0 | 2026-03-01 | 실제 구현 기준으로 전면 재작성 |
| 0.1 | 2024-12-22 | 초안 작성 |
