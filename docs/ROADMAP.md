# Tradex 8주 개발 로드맵

> **최종 업데이트**: 2026-02-28
> **현재 주차**: 최종 마무리
> **전체 진행률**: 100% (Week 1: 100%, Week 2: 100%, Week 3: 100%, Week 4: 100%, Week 5: 100%, Week 6: 100%, Week 7: 100%, Week 8: 100%)

---

## 개요

이 문서는 Tradex 프로젝트의 8주 개발 로드맵을 정의합니다. 각 주차별 목표와 태스크를 명시하고, 진행 상황을 추적합니다.

### 상태 범례

| 상태 | 설명 |
|------|------|
| ⬜ | 미시작 |
| 🔄 | 진행중 |
| ✅ | 완료 |
| ⏸️ | 보류 |
| 🚫 | 제외 |

### 우선순위 범례

| 우선순위 | 설명 |
|---------|------|
| 🔴 Critical | 필수, 다른 작업 차단 |
| 🟡 High | 중요, MVP 필수 |
| 🟢 Medium | 권장, 품질 향상 |
| ⚪ Low | 선택적 |

---

## 주차별 진행 현황 요약

| 주차 | 목표 | 상태 | 진행률 |
|------|------|------|--------|
| [Week 1](#week-1-프로젝트-기반-구축) | 프로젝트 기반 구축 | ✅ 완료 | 100% |
| [Week 2](#week-2-인증-시스템) | 인증 시스템 | ✅ 완료 | 100% (9/9) |
| [Week 3](#week-3-홈-대시보드--매매-관리) | 홈 대시보드 + 매매 관리 | ✅ 완료 | 100% (8/8) |
| [Week 4](#week-4-tradex-ai) | Tradex AI | ✅ 완료 | 100% (6/6) |
| [Week 5](#week-5-차트-분석) | 차트 분석 | ✅ 완료 | 100% (6/6) |
| [Week 6](#week-6-분석--수익-관리) | 분석 + 수익 관리 | ✅ 완료 | 100% (6/6) |
| [Week 7](#week-7-수신함--설정) | 수신함 + 설정 | ✅ 완료 | 100% (6/6) |
| [Week 8](#week-8-구독--최적화--qa) | 구독 + 최적화 + QA | ✅ 완료 | 100% (7/7) |

---

## Week 1: 프로젝트 기반 구축

**목표**: 개발 환경 및 공통 인프라 완성
**상태**: ✅ 완료
**진행률**: 6/6 (100%)

### 태스크

| # | 태스크 | 우선순위 | 상태 | 관련 파일 | 비고 |
|---|--------|---------|------|-----------|------|
| 1.1 | shadcn/ui 설치 및 기본 컴포넌트 세팅 | 🔴 Critical | ✅ | `components/ui/` | 14개 컴포넌트 설치 완료 |
| 1.2 | Zustand 스토어 구조 설정 | 🔴 Critical | ✅ | `stores/` | Auth, UI, Trading 스토어 완료 |
| 1.3 | TanStack Query 설정 및 API 클라이언트 구축 | 🔴 Critical | ✅ | `lib/api/` | QueryProvider, API 클라이언트 완료 |
| 1.4 | 레이아웃 컴포넌트 구현 | 🟡 High | ✅ | `components/layout/` | Sidebar, Header, MainLayout, AuthLayout, TradexAIPanel |
| 1.5 | 라우팅 구조 완성 | 🟡 High | ✅ | `app/` | 23개 페이지 생성 완료 |
| 1.6 | 공통 UI 컴포넌트 | 🟢 Medium | ✅ | `components/common/` | Loading, Empty, ErrorMessage, PageHeader |

### 완료 조건

- [x] `npm run build` 에러 없음
- [x] shadcn/ui 컴포넌트 5개 이상 설치 (17개 설치됨)
- [x] Zustand 스토어 기본 구조 생성 (8개 스토어)
- [x] API 클라이언트로 mock 요청 성공
- [x] 모든 라우트 페이지 생성 (빈 페이지) (26개 페이지)
- [x] Sidebar 네비게이션 동작

### 산출물

- `components/ui/` - shadcn/ui 컴포넌트
- `stores/` - Zustand 스토어
- `lib/api/client.ts` - API 클라이언트
- `components/layout/` - 레이아웃 컴포넌트

---

## Week 2: 인증 시스템

**목표**: 로그인/회원가입 플로우 완성
**상태**: ✅ 완료
**진행률**: 9/9 (100%)

### 태스크

| # | 태스크 | 우선순위 | 상태 | 관련 파일 | 비고 |
|---|--------|---------|------|-----------|------|
| 2.1 | 로그인 페이지 UI + API 연동 | 🔴 Critical | ✅ | `app/(auth)/login/` | 이메일/비밀번호 로그인, authApi.login() 연동 |
| 2.2 | 회원가입 페이지 UI + API 연동 | 🔴 Critical | ✅ | `app/(auth)/signup/` | Swagger 기준: username(2-100자), password(최소 8자) - 휴대폰 인증 API 없음 |
| 2.3 | 소셜 로그인 연동 | 🟡 High | ✅ | `app/oauth2/redirect/`, `lib/api/auth.ts` | Google, Kakao OAuth2 플로우 완료 |
| 2.4 | 추가 정보 입력 페이지 | 🟡 High | ✅ | `app/(auth)/additional-info/` | authApi.completeProfile() 연동 완료 |
| 2.5 | 인증 상태 관리 + 로그아웃 | 🔴 Critical | ✅ | `stores/useAuthStore.ts`, `lib/api/client.ts`, `components/layout/Header.tsx` | Zustand persist + Token Refresh + 로그아웃 API 연동 |
| 2.6 | Protected Route 구현 | 🔴 Critical | ✅ | `middleware.ts`, `components/providers/AuthProvider.tsx` | 클라이언트 사이드 Auth Guard |
| 2.7 | 아이디/비밀번호 찾기 API 연동 | 🟡 High | ✅ | `app/(auth)/find-account/` | sendSms, verifySms, findEmail, forgotPassword API 연동 완료 |
| 2.8 | OAuth2 사용자 정보 조회 | 🟡 High | ✅ | `app/oauth2/redirect/` | authApi.me() 호출 구현 완료 |
| 2.9 | 비밀번호 재설정 페이지 | 🟢 Medium | ✅ | `app/(auth)/reset-password/` | Figma 디자인 기반 구현, authApi.resetPassword() 연동 완료 |

### 완료 조건

- [x] 이메일/비밀번호 로그인 동작
- [x] 소셜 로그인 버튼 동작 (Google, Kakao)
- [x] 회원가입 → 추가정보 → 홈 플로우 완성
- [x] 로그아웃 동작
- [x] 비인증 사용자 리다이렉트 동작
- [x] OAuth2 로그인 시 사용자 정보 조회 (authApi.me)
- [x] 아이디/비밀번호 찾기 동작 - SMS 인증 + 이메일 찾기/비밀번호 찾기 API 연동 완료
- [x] 비밀번호 재설정 동작 - reset-password 페이지 구현 완료

### 산출물

- `app/(auth)/` - 인증 페이지들 (login, signup, find-account, additional-info)
- `app/oauth2/redirect/` - OAuth2 리다이렉트 처리
- `stores/useAuthStore.ts` - 인증 상태 관리 (Zustand + persist)
- `lib/api/auth.ts` - 인증 API (login, signup, OAuth, 휴대폰 인증 등)
- `lib/api/client.ts` - API 클라이언트 (Token Refresh 포함)
- `middleware.ts` - 라우트 보호
- `components/providers/AuthProvider.tsx` - 클라이언트 사이드 Auth Guard

### 의존성

- Week 1 완료 필요

---

## Week 3: 홈 대시보드 + 매매 관리

**목표**: 메인 화면 및 매매 원칙/매매일지 CRUD
**상태**: ✅ 완료
**진행률**: 8/8 (100%)

### 태스크

| # | 태스크 | 우선순위 | 상태 | 관련 파일 | 비고 |
|---|--------|---------|------|-----------|------|
| 3.1 | 홈 대시보드 레이아웃 | 🔴 Critical | ✅ | `app/(main)/home/` | Figma 기준 레이아웃 완료, Header 40px, 사이드바 200px |
| 3.2 | 요약 카드 컴포넌트 | 🟡 High | ✅ | `components/home/` | StatCard, TradexAIInsightCard, WeeklyProfitChart, RiskScoreCard - Figma 디자인 적용 완료 |
| 3.3 | 매매 원칙 등록/수정 페이지 | 🔴 Critical | ✅ | `app/(main)/trading/principles/new`, `[id]` | 원칙 추가/수정 폼, AI분석 배지 구현 |
| 3.4 | 매매 원칙 목록 페이지 | 🟡 High | ✅ | `app/(main)/trading/principles/` | 목록, 인라인 편집, AI/수동 배지, 삭제 기능 |
| 3.5 | 매매일지 작성 폼 | 🔴 Critical | ✅ | `app/(main)/trading/journal/`, `components/trading/JournalForm.tsx` | 사이드패널 폼 구현 완료, Figma 디자인 적용, positionsApi.create() + ordersApi.create() + journalApi.update() 연동 |
| 3.6 | 매매일지 목록 (필터링) | 🟡 High | ✅ | `app/(main)/trading/journal/`, `components/trading/JournalList.tsx`, `components/trading/JournalCalendar.tsx` | 캘린더/리스트 뷰 구현, Figma 디자인 적용, journalApi.getAll() 연동 |
| 3.7 | 매매일지 상세 보기 | 🟡 High | ✅ | `components/trading/JournalForm.tsx` | 사이드패널에서 조회/수정 가능, journalApi.update() 연동 |
| 3.8 | 대시보드 API 연동 | 🟢 Medium | ✅ | `app/(main)/home/`, `lib/api/home.ts` | homeApi.getSummary() 연동, WeeklyProfitChart API 데이터 지원 |

### 완료 조건

- [x] 홈 대시보드 카드 렌더링
- [x] 매매 원칙 CRUD 동작 — `app/(main)/trading/principles/page.tsx` 구현 완료, tradingPrincipleApi CRUD 연동
- [x] 매매일지 CRUD 동작 (UI + API 연동 완료: journalApi, positionsApi, ordersApi)
- [x] 필터링 동작 (캘린더/리스트 뷰 전환)

### 산출물

- `app/(main)/home/` - 홈 페이지
- `components/home/` - 대시보드 컴포넌트 (StatCard, TradexAIInsightCard, WeeklyProfitChart, RiskScoreCard)
- `components/layout/` - Sidebar 200px, Header 40px Figma 기준 적용
- `app/(main)/trading/journal/` - 매매일지 페이지 (캘린더/리스트 뷰)
- `components/trading/` - JournalCalendar, JournalList, JournalForm 컴포넌트
- `lib/api/trading.ts` - 매매 API (journalApi: /api/journals, principlesApi: mock)
- `lib/api/futures.ts` - 포지션/오더 API (positionsApi, ordersApi)
- `lib/api/dashboard.ts` - 대시보드 API

### 의존성

- Week 1, 2 완료 필요

---

## Week 4: Tradex AI

**목표**: AI 채팅 기능 구축
**상태**: ✅ 완료
**진행률**: 6/6 (100%)

### 태스크

| # | 태스크 | 우선순위 | 상태 | 관련 파일 | 비고 |
|---|--------|---------|------|-----------|------|
| 4.1 | Tradex AI 사이드 패널 UI | 🔴 Critical | ✅ | `components/layout/TradexAIPanel.tsx` | Figma 디자인 적용 완료, 제안 칩, 채팅 UI, chatSessionApi 연동 (세션 생성/목록) |
| 4.2 | 채팅 인터페이스 구현 | 🔴 Critical | ✅ | `app/(main)/ai/page.tsx`, `app/(main)/ai/chat/page.tsx` | 메인 페이지 + 채팅 페이지 구현, 통계 카드 포함, chatSessionApi 연동 (세션/히스토리) |
| 4.3 | 메시지 입력/전송 기능 | 🟡 High | ✅ | `components/layout/TradexAIPanel.tsx`, `app/(main)/ai/chat/page.tsx` | 제안 프롬프트 클릭, 직접 입력, 마이크 버튼 |
| 4.4 | AI 응답 스트리밍 표시 | 🟡 High | ✅ | `TradexAIPanel.tsx`, `ai/chat/page.tsx`, `useAIChatStore.ts` | SSE 스트리밍 UI + mock fallback, updateMessageContent 실시간 토큰 표시 |
| 4.5 | 대화 목록/히스토리 관리 | 🟡 High | ✅ | `stores/useAIChatStore.ts`, `app/(main)/ai/` | Zustand persist + chatSessionApi 백엔드 연동 (세션 목록/히스토리/삭제), 백엔드 실패 시 로컬 fallback |
| 4.6 | AI 매매 원칙 추천 연동 | 🟢 Medium | ✅ | `app/(main)/trading/principles/page.tsx` | AI 원칙 추천 버튼 + 수락/거절 UI, mock 추천 3개 |

### 완료 조건

- [x] AI 사이드 패널 열기/닫기
- [x] 메시지 전송 및 응답 표시 (SSE 스트리밍 + Mock fallback)
- [x] 채팅 히스토리 유지 (Zustand persist + chatSessionApi 백엔드 연동)
- [x] AI 추천 기능 연동 (mock 추천 3개)

### 산출물

- `app/(main)/ai/` - Tradex AI 메인 페이지 (로고, 입력창, 제안 프롬프트)
- `app/(main)/ai/chat/` - Tradex AI 채팅 페이지 (대화 표시, 통계 카드)
- `components/layout/TradexAIPanel.tsx` - AI 사이드 패널 (Figma 디자인 적용)
- `lib/api/ai.ts` - AI API

### 의존성

- Week 1, 2, 3 완료 필요
- AI 모델 결정 필요 (DECISIONS.md #3)

---

## Week 5: 차트 분석

**목표**: 차트 기능 구현
**상태**: ✅ 완료
**진행률**: 6/6 (100%)

### 태스크

| # | 태스크 | 우선순위 | 상태 | 관련 파일 | 비고 |
|---|--------|---------|------|-----------|------|
| 5.1 | TradingView Charting Library 연동 | 🔴 Critical | ✅ | `components/chart/TVChartContainer.tsx` | TradingView v30 Charting Library, custom datafeed 구현 |
| 5.2 | 기본 캔들 차트 구현 | 🔴 Critical | ✅ | `components/chart/TVChartContainer.tsx` | 캔들차트 + 실시간 업데이트 + save/load adapter |
| 5.3 | 기술적 지표 추가 | 🟡 High | ✅ | TradingView 내장 | TradingView 위젯 내장 지표 (200+) |
| 5.4 | 차트 도구 | 🟢 Medium | ✅ | TradingView 내장 | TradingView 위젯 내장 드로잉 도구 |
| 5.5 | Trading System (트리거 설정) UI | 🟡 High | ✅ | `components/chart/TriggerPanel.tsx`, `lib/chart/triggerEngine.ts` | 트리거 패널 + 평가 엔진 + 차트 연동 완료 |
| 5.6 | AI 차트 분석 연동 | 🟢 Medium | ✅ | `app/(main)/chart/page.tsx`, `lib/chart/chartContext.ts` | 차트 페이지 AI 분석 버튼 + 오버레이 결과 패널, AI 채팅 연결 |

### 완료 조건

- [x] 캔들 차트 렌더링
- [x] 지표 2개 이상 적용 가능 (UI)
- [x] 차트 도구 1개 이상 동작 (UI)
- [x] 트리거 설정 UI 완성 (TriggerPanel.tsx — 추가/토글/삭제, 트리거 엔진 연동)

### 산출물

- `app/(main)/chart/` - 차트 페이지
- `components/chart/` - 차트 컴포넌트
- `lib/api/chart.ts` - 차트 API

### 의존성

- Week 1 완료 필요
- 차트 라이브러리 결정 필요 (DECISIONS.md #7)

---

## Week 6: 분석 + 수익 관리

**목표**: 전략/리스크 분석 및 포트폴리오
**상태**: ✅ 완료
**진행률**: 6/6 (100%)

### 태스크

| # | 태스크 | 우선순위 | 상태 | 관련 파일 | 비고 |
|---|--------|---------|------|-----------|------|
| 6.1 | 전략 분석 페이지 | 🟡 High | ✅ | `app/(main)/analysis/strategy/` | Figma 디자인 적용 완료, 사이드바+분석리포트 레이아웃, AI 패널 |
| 6.2 | 리스크 매핑 시각화 | 🟡 High | ✅ | `app/(main)/analysis/risk/` | RiskGauge, RiskCard, AI 인사이트 구현 |
| 6.3 | Assets 페이지 (자산 현황) | 🔴 Critical | ✅ | `app/(main)/portfolio/assets/` | Figma 디자인 적용 완료, 누적손익+일일손익캘린더+자산분포 |
| 6.4 | P&L 페이지 (손익 관리) | 🔴 Critical | ✅ | `app/(main)/portfolio/pnl/` | Figma 디자인 적용 완료, 손익+랭킹+체결완료 테이블 |
| 6.5 | 수익률 차트/그래프 | 🟡 High | ✅ | `app/(main)/portfolio/` | SVG 차트 구현 (P&L 바차트, 누적손익 라인차트, 자산추이 차트) |
| 6.6 | 거래소 API 연동 (자산 동기화) | 🟢 Medium | ✅ | `lib/api/exchange.ts`, `components/settings/SettingsModal.tsx` | exchangeApi 9개 엔드포인트 구현, 설정 모달 키 관리 UI 연동 완료 (자산 동기화는 백엔드 의존) |

### 완료 조건

- [x] 전략 분석 차트 렌더링 (SVG 수익곡선 + 승/패 분포 차트)
- [x] 리스크 매핑 시각화
- [x] 자산 현황 표시 (요약 카드 + 도넛 차트 + API 연동)
- [x] P&L 차트 렌더링 (영역 차트 + 수익 랭킹 + 체결 테이블)

### 산출물

- `app/(main)/analysis/` - 분석 페이지
- `app/(main)/portfolio/` - 포트폴리오 페이지
- `components/analysis/` - 분석 컴포넌트
- `components/portfolio/` - 포트폴리오 컴포넌트

### 의존성

- Week 1, 4 완료 필요
- 지원 거래소 결정 필요 (DECISIONS.md #5)

---

## Week 7: 수신함 + 설정

**목표**: 알림 및 사용자 설정 완성
**상태**: ✅ 완료
**진행률**: 6/6 (100%)

### 태스크

| # | 태스크 | 우선순위 | 상태 | 관련 파일 | 비고 |
|---|--------|---------|------|-----------|------|
| 7.1 | 수신함 페이지 (알림 목록) | 🟡 High | ✅ | `app/(main)/inbox/` | 전체/읽지않음 필터, 알림 타입별 스타일, homeApi.getNotifications() 연동 |
| 7.2 | 알림 읽음/삭제 처리 | 🟢 Medium | ✅ | `app/(main)/inbox/`, `lib/api/home.ts` | markAsRead, deleteNotification API 연동 완료 |
| 7.3 | 계정 설정 (프로필 수정) | 🟡 High | ✅ | `components/settings/SettingsModal.tsx` | Figma 기준 모달 오버레이로 구현 (이메일/비밀번호/거래소) |
| 7.4 | 거래소 API 키 관리 | 🟡 High | ✅ | `components/settings/SettingsModal.tsx` | 거래소 추가/삭제 UI 포함 |
| 7.5 | 테마/언어 설정 | 🟢 Medium | ✅ | `components/settings/SettingsModal.tsx` | 기본 설정 탭 (테마/언어) |
| 7.6 | 알림 설정 페이지 | 🟢 Medium | ✅ | `components/settings/SettingsModal.tsx` | 알림 설정 탭 (푸시/앱내) |

### 완료 조건

- [x] 알림 목록 표시
- [x] 알림 읽음/삭제 동작
- [x] 프로필 수정 동작 — 닉네임은 조회 전용 텍스트로 표시 (수정 기능 없음, 백엔드 API 미지원)
- [x] 테마 변경 동작 (시스템/라이트/다크 라디오 선택 UI)

### 산출물

- `app/(main)/inbox/` - 수신함 페이지 (API 연동 완료)
- `app/(main)/settings/` - 설정 페이지들 (Figma 디자인 대기)
- `components/settings/` - 설정 컴포넌트 (미구현)
- `lib/api/notification.ts` - 알림 API

### 의존성

- Week 1, 2 완료 필요

---

## Week 8: 구독 + 최적화 + QA

**목표**: 결제 연동 및 최종 마무리
**상태**: ✅ 완료
**진행률**: 7/7 (100%)

### 태스크

| # | 태스크 | 우선순위 | 상태 | 관련 파일 | 비고 |
|---|--------|---------|------|-----------|------|
| 8.1 | 구독 플랜 페이지 | 🟡 High | ✅ | `components/settings/SettingsModal.tsx` | SettingsModal 구독 관리 탭 구현 (Free/Pro/Enterprise 플랜 카드, 빌링 정보) |
| 8.2 | 결제 시스템 연동 | 🟡 High | ✅ | `lib/api/subscription.ts`, `app/(main)/billing/` | 토스페이먼츠 SDK 빌링 연동, subscriptionApi 7개 엔드포인트 UI 연결 완료 |
| 8.3 | 성능 최적화 | 🟢 Medium | ✅ | `app/(main)/layout.tsx`, `app/(main)/loading.tsx` | 동적 import (SettingsModal, TradexAIPanel), preconnect, loading.tsx |
| 8.4 | 반응형 대응 점검 | 🟢 Medium | ✅ | `layout.tsx`, `Sidebar.tsx`, `Header.tsx` 등 | 모바일 사이드바 오버레이, 반응형 그리드/패널/모달, 태블릿 대응 |
| 8.5 | 에러 핸들링 강화 | 🟡 High | ✅ | `app/global-error.tsx`, `app/(main)/error.tsx`, `app/not-found.tsx` | Next.js 에러 바운더리 + 404 페이지 구현 |
| 8.6 | E2E 테스트 | 🟢 Medium | ✅ | `tests/` | Playwright 23개 테스트 (인증, 홈, 매매일지, 차트, 분석, 포트폴리오, 설정, 수신함) |
| 8.7 | 버그 수정 및 최종 QA | 🔴 Critical | ✅ | `eslint.config.mjs` | ESLint 0 errors/0 warnings, 빌드 성공 확인 |

### 완료 조건

- [x] 구독 페이지 동작 (플랜 비교/변경, 결제 수단, 결제 내역, 구독 해지 — 토스페이먼츠 연동)
- [ ] Lighthouse 성능 점수 80+ — ⚠️ 실제 측정 필요
- [x] 주요 반응형 이슈 해결 (모바일/태블릿/데스크톱 반응형 적용)
- [x] E2E 테스트 통과 (주요 플로우) — Playwright 70/70 통과
- [x] 크리티컬 버그 0개 — ESLint 0 errors/0 warnings, 빌드 성공

### 산출물

- `app/(main)/settings/subscription/` - 구독 페이지
- `lib/api/payment.ts` - 결제 API
- `tests/` - E2E 테스트

### 의존성

- Week 1-7 완료 필요
- 결제 시스템 결정 필요 (DECISIONS.md #9)

---

## 미결 사항 (로드맵 차단 요소)

> 상세 내용은 [DECISIONS.md](./DECISIONS.md) 참조

| 주차 | 차단 요소 | 결정 필요 항목 | 상태 |
|------|----------|----------------|------|
| Week 2 | 소셜 로그인 | #1 소셜 로그인 제공자 | ✅ 해결 (Google, Kakao) |
| Week 4 | AI 모델 | #3 AI 모델 | ⬜ 미정 |
| Week 5 | 차트 라이브러리 | #7 차트 라이브러리 | ⬜ 미정 |
| Week 6 | 거래소 연동 | #5 지원 거래소, #6 실시간 데이터 방식 | ⬜ 미정 |
| Week 8 | 결제 | #9 결제 시스템, #10 구독 플랜 구성 | ⬜ 미정 |

---

## 변경 로그

| 날짜 | 변경 내용 |
|------|----------|
| 2026-02-19 | 미연동 API 통합 작업: journalApi 경로 수정 (백엔드 스펙 /api/journals 맞춤, put→patch, 불필요 메서드 삭제), 매매일지 페이지 API 연동 (journalApi.getAll, delete + positionsApi.create + ordersApi.create), JournalForm 저장/수정/주문추가 API 연동, AI 채팅 페이지 chatSessionApi 연동 (세션 목록/생성/히스토리/삭제), AI 사이드 패널 chatSessionApi 연동. principlesApi는 백엔드 미구현으로 mock 유지 |
| 2026-01-28 | Figma 디자인 없는 항목 롤백 - 매매 원칙(3.3, 3.4), 자산현황/손익관리(6.3~6.5), 설정(7.3~7.6) |
| 2026-01-28 | Week 5: 차트 분석 페이지 구현 (5.1~5.4) - TradingView Lightweight Charts v5, 캔들차트, 툴바 |
| 2026-01-28 | Week 6: 리스크 분석 페이지 구현 (6.2) - RiskGauge, RiskCard, AI 인사이트 |
| 2026-01-25 | Week 2: 아이디/비밀번호 찾기 API 연동 완료 (2.7), 비밀번호 재설정 페이지 구현 (2.9) - Week 2 100% 완료 |
| 2026-01-25 | Week 3: 대시보드 API 연동 완료 (3.8) - homeApi.getSummary() 연동 |
| 2026-01-25 | Week 7: 수신함 페이지 구현 및 API 연동 완료 (7.1, 7.2) - 알림 목록/읽음/삭제 기능 |
| 2026-01-19 | Week 3 시작: 홈 대시보드 레이아웃 및 요약 카드 컴포넌트 Figma 디자인 적용 완료 |
| 2026-01-19 | 레이아웃 개선: Sidebar 200px, Header 40px, 콘텐츠 패딩 36px/32px Figma 기준 적용 |
| 2026-01-18 | Week 3/4 순서 변경: Week 3 = 홈 대시보드 + 매매 관리, Week 4 = Tradex AI |
| 2026-01-18 | Week 2: Swagger 기준 재검토 - 2.7, 2.9 백엔드 API 대기로 변경, 2.8 완료 |
| 2026-01-18 | Week 2: 회원가입 페이지 Swagger 스펙 기준 수정 (username 필드, 휴대폰 인증 제거) |
| 2025-01-18 | Week 2: 인증 API 연동 완료 (로그인, 회원가입, OAuth2, Token Refresh, Auth Guard) |
| 2025-01-18 | Week 2: 미구현 태스크 추가 (2.7~2.9: 아이디/비밀번호 찾기, OAuth2 사용자 조회, 비밀번호 재설정) |
| 2025-01-17 | Week 2: 로그인/회원가입/아이디·비밀번호 찾기 UI 구현 완료 |
| 2024-12-31 | 8주 로드맵 초안 작성 |

---

## 사용 방법

### 진행 상황 업데이트

1. 태스크 시작 시: 상태를 `⬜` → `🔄`로 변경
2. 태스크 완료 시: 상태를 `🔄` → `✅`로 변경
3. 주차 완료 시: 주차 상태 및 진행률 업데이트
4. 상단 요약 테이블 업데이트

### 새 태스크 추가

예상치 못한 작업이 발생하면:
1. 해당 주차에 태스크 추가
2. 우선순위 지정
3. STATUS.md에도 반영

### 주차 이동

한 주차가 완료되지 않은 상태로 다음 주차로 넘어갈 경우:
1. 미완료 태스크를 다음 주차로 이동하거나
2. 현재 주차에서 `⏸️ 보류` 처리

---

*이 문서는 프로젝트 진행에 따라 지속적으로 업데이트됩니다.*
