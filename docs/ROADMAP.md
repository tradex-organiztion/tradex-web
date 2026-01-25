# Tradex 8주 개발 로드맵

> **최종 업데이트**: 2026-01-25
> **현재 주차**: Week 3 + Week 4
> **전체 진행률**: 45% (Week 1: 100%, Week 2: 100%, Week 3: 75%, Week 4: 50% 진행중)

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
| [Week 2](#week-2-인증-시스템) | 인증 시스템 | ✅ 완료 | 100% (7/9, 2개 백엔드 API 대기) |
| [Week 3](#week-3-홈-대시보드--매매-관리) | 홈 대시보드 + 매매 관리 | 🔄 진행중 | 75% (6/8) |
| [Week 4](#week-4-tradex-ai) | Tradex AI | 🔄 진행중 | 50% (3/6) |
| [Week 5](#week-5-차트-분석) | 차트 분석 | ⬜ 미시작 | 0% |
| [Week 6](#week-6-분석--수익-관리) | 분석 + 수익 관리 | ⬜ 미시작 | 0% |
| [Week 7](#week-7-수신함--설정) | 수신함 + 설정 | ⬜ 미시작 | 0% |
| [Week 8](#week-8-구독--최적화--qa) | 구독 + 최적화 + QA | ⬜ 미시작 | 0% |

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

- [ ] `npm run build` 에러 없음
- [ ] shadcn/ui 컴포넌트 5개 이상 설치
- [ ] Zustand 스토어 기본 구조 생성
- [ ] API 클라이언트로 mock 요청 성공
- [ ] 모든 라우트 페이지 생성 (빈 페이지)
- [ ] Sidebar 네비게이션 동작

### 산출물

- `components/ui/` - shadcn/ui 컴포넌트
- `stores/` - Zustand 스토어
- `lib/api/client.ts` - API 클라이언트
- `components/layout/` - 레이아웃 컴포넌트

---

## Week 2: 인증 시스템

**목표**: 로그인/회원가입 플로우 완성
**상태**: ✅ 완료 (백엔드 API 대기 항목 제외)
**진행률**: 7/9 (78%) - 2개 백엔드 API 대기

### 태스크

| # | 태스크 | 우선순위 | 상태 | 관련 파일 | 비고 |
|---|--------|---------|------|-----------|------|
| 2.1 | 로그인 페이지 UI + API 연동 | 🔴 Critical | ✅ | `app/(auth)/login/` | 이메일/비밀번호 로그인, authApi.login() 연동 |
| 2.2 | 회원가입 페이지 UI + API 연동 | 🔴 Critical | ✅ | `app/(auth)/signup/` | Swagger 기준: username(2-100자), password(최소 8자) - 휴대폰 인증 API 없음 |
| 2.3 | 소셜 로그인 연동 | 🟡 High | ✅ | `app/oauth2/redirect/`, `lib/api/auth.ts` | Google, Kakao OAuth2 플로우 완료 |
| 2.4 | 추가 정보 입력 페이지 | 🟡 High | ✅ | `app/(auth)/additional-info/` | authApi.completeProfile() 연동 완료 |
| 2.5 | 인증 상태 관리 + 로그아웃 | 🔴 Critical | ✅ | `stores/useAuthStore.ts`, `lib/api/client.ts`, `components/layout/Header.tsx` | Zustand persist + Token Refresh + 로그아웃 API 연동 |
| 2.6 | Protected Route 구현 | 🔴 Critical | ✅ | `middleware.ts`, `components/providers/AuthProvider.tsx` | 클라이언트 사이드 Auth Guard |
| 2.7 | 아이디/비밀번호 찾기 API 연동 | 🟡 High | ⏸️ | `app/(auth)/find-account/` | **백엔드 API 대기** - Swagger에 findId, forgotPassword API 없음 |
| 2.8 | OAuth2 사용자 정보 조회 | 🟡 High | ✅ | `app/oauth2/redirect/` | authApi.me() 호출 구현 완료 |
| 2.9 | 비밀번호 재설정 페이지 | 🟢 Medium | ⏸️ | `app/(auth)/reset-password/` | **백엔드 API 대기** - Swagger에 resetPassword API 없음 |

### 완료 조건

- [x] 이메일/비밀번호 로그인 동작
- [x] 소셜 로그인 버튼 동작 (Google, Kakao)
- [x] 회원가입 → 추가정보 → 홈 플로우 완성
- [x] 로그아웃 동작
- [x] 비인증 사용자 리다이렉트 동작
- [x] OAuth2 로그인 시 사용자 정보 조회 (authApi.me)
- [ ] 아이디/비밀번호 찾기 동작 - ⏸️ 백엔드 API 대기
- [ ] 비밀번호 재설정 동작 - ⏸️ 백엔드 API 대기

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
**상태**: 🔄 진행중
**진행률**: 6/8 (75%)

### 태스크

| # | 태스크 | 우선순위 | 상태 | 관련 파일 | 비고 |
|---|--------|---------|------|-----------|------|
| 3.1 | 홈 대시보드 레이아웃 | 🔴 Critical | ✅ | `app/(main)/home/` | Figma 기준 레이아웃 완료, Header 40px, 사이드바 200px |
| 3.2 | 요약 카드 컴포넌트 | 🟡 High | ✅ | `components/home/` | StatCard, TradexAIInsightCard, WeeklyProfitChart, RiskScoreCard - Figma 디자인 적용 완료 |
| 3.3 | 매매 원칙 등록/수정 페이지 | 🔴 Critical | ⬜ | `app/(main)/trading/principles/` | - |
| 3.4 | 매매 원칙 목록 페이지 | 🟡 High | ⬜ | `app/(main)/trading/principles/` | - |
| 3.5 | 매매일지 작성 폼 | 🔴 Critical | ✅ | `app/(main)/trading/journal/`, `components/trading/JournalForm.tsx` | 사이드패널 폼 구현 완료, Figma 디자인 적용 |
| 3.6 | 매매일지 목록 (필터링) | 🟡 High | ✅ | `app/(main)/trading/journal/`, `components/trading/JournalList.tsx`, `components/trading/JournalCalendar.tsx` | 캘린더/리스트 뷰 구현, Figma 디자인 적용 |
| 3.7 | 매매일지 상세 보기 | 🟡 High | ✅ | `components/trading/JournalForm.tsx` | 사이드패널에서 조회/수정 가능 |
| 3.8 | 대시보드 API 연동 | 🟢 Medium | ⬜ | `lib/api/dashboard.ts` | 요약 데이터, 알림 |

### 완료 조건

- [x] 홈 대시보드 카드 렌더링
- [ ] 매매 원칙 CRUD 동작
- [x] 매매일지 CRUD 동작 (UI 완료, API 연동 대기)
- [x] 필터링 동작 (캘린더/리스트 뷰 전환)

### 산출물

- `app/(main)/home/` - 홈 페이지
- `components/home/` - 대시보드 컴포넌트 (StatCard, TradexAIInsightCard, WeeklyProfitChart, RiskScoreCard)
- `components/layout/` - Sidebar 200px, Header 40px Figma 기준 적용
- `app/(main)/trading/journal/` - 매매일지 페이지 (캘린더/리스트 뷰)
- `components/trading/` - JournalCalendar, JournalList, JournalForm 컴포넌트
- `lib/api/trading.ts` - 매매 API
- `lib/api/dashboard.ts` - 대시보드 API

### 의존성

- Week 1, 2 완료 필요

---

## Week 4: Tradex AI

**목표**: AI 채팅 기능 구축
**상태**: 🔄 진행중
**진행률**: 3/6 (50%)

### 태스크

| # | 태스크 | 우선순위 | 상태 | 관련 파일 | 비고 |
|---|--------|---------|------|-----------|------|
| 4.1 | Tradex AI 사이드 패널 UI | 🔴 Critical | ✅ | `components/layout/TradexAIPanel.tsx` | Figma 디자인 적용 완료, 제안 칩, 채팅 UI |
| 4.2 | 채팅 인터페이스 구현 | 🔴 Critical | ✅ | `app/(main)/ai/page.tsx`, `app/(main)/ai/chat/page.tsx` | 메인 페이지 + 채팅 페이지 구현, 통계 카드 포함 |
| 4.3 | 메시지 입력/전송 기능 | 🟡 High | ✅ | `components/layout/TradexAIPanel.tsx`, `app/(main)/ai/chat/page.tsx` | 제안 프롬프트 클릭, 직접 입력, 마이크 버튼 |
| 4.4 | AI 응답 스트리밍 표시 | 🟡 High | ⬜ | `components/ai/ChatMessage.tsx` | SSE 스트리밍 (API 연동 필요) |
| 4.5 | 대화 목록/히스토리 관리 | 🟡 High | ⬜ | `components/ai/ConversationList.tsx` | - |
| 4.6 | AI 매매 원칙 추천 연동 | 🟢 Medium | ⬜ | `components/trading/` | 매매 관리와 연동 |

### 완료 조건

- [x] AI 사이드 패널 열기/닫기
- [x] 메시지 전송 및 응답 표시 (Mock)
- [ ] 채팅 히스토리 유지
- [ ] AI 추천 기능 연동

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
**상태**: ⬜ 미시작
**진행률**: 0/6 (0%)

### 태스크

| # | 태스크 | 우선순위 | 상태 | 관련 파일 | 비고 |
|---|--------|---------|------|-----------|------|
| 5.1 | TradingView Lightweight Charts 연동 | 🔴 Critical | ⬜ | `components/chart/` | - |
| 5.2 | 기본 캔들 차트 구현 | 🔴 Critical | ⬜ | `components/chart/CandleChart.tsx` | - |
| 5.3 | 기술적 지표 추가 | 🟡 High | ⬜ | `components/chart/indicators/` | MA, RSI, MACD 등 |
| 5.4 | 차트 도구 | 🟢 Medium | ⬜ | `components/chart/tools/` | 라인, 피보나치 등 |
| 5.5 | Trading System (트리거 설정) UI | 🟡 High | ⬜ | `components/chart/TriggerForm.tsx` | - |
| 5.6 | AI 차트 분석 연동 | 🟢 Medium | ⬜ | `lib/api/chart.ts` | 스크린샷 → AI 분석 |

### 완료 조건

- [ ] 캔들 차트 렌더링
- [ ] 지표 2개 이상 적용 가능
- [ ] 차트 도구 1개 이상 동작
- [ ] 트리거 설정 UI 완성

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
**상태**: ⬜ 미시작
**진행률**: 0/6 (0%)

### 태스크

| # | 태스크 | 우선순위 | 상태 | 관련 파일 | 비고 |
|---|--------|---------|------|-----------|------|
| 6.1 | 전략 분석 페이지 | 🟡 High | ⬜ | `app/(main)/analysis/strategy/` | 변수별 성과 |
| 6.2 | 리스크 매핑 시각화 | 🟡 High | ⬜ | `app/(main)/analysis/risk/` | - |
| 6.3 | Assets 페이지 (자산 현황) | 🔴 Critical | ⬜ | `app/(main)/portfolio/assets/` | - |
| 6.4 | P&L 페이지 (손익 관리) | 🔴 Critical | ⬜ | `app/(main)/portfolio/pnl/` | - |
| 6.5 | 수익률 차트/그래프 | 🟡 High | ⬜ | `components/portfolio/` | - |
| 6.6 | 거래소 API 연동 (자산 동기화) | 🟢 Medium | ⬜ | `lib/api/exchange.ts` | - |

### 완료 조건

- [ ] 전략 분석 차트 렌더링
- [ ] 리스크 매핑 시각화
- [ ] 자산 현황 표시
- [ ] P&L 차트 렌더링

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
**상태**: ⬜ 미시작
**진행률**: 0/6 (0%)

### 태스크

| # | 태스크 | 우선순위 | 상태 | 관련 파일 | 비고 |
|---|--------|---------|------|-----------|------|
| 7.1 | 수신함 페이지 (알림 목록) | 🟡 High | ⬜ | `app/(main)/inbox/` | - |
| 7.2 | 알림 읽음/삭제 처리 | 🟢 Medium | ⬜ | `lib/api/notification.ts` | - |
| 7.3 | 계정 설정 (프로필 수정) | 🟡 High | ⬜ | `app/(main)/settings/account/` | - |
| 7.4 | 거래소 API 키 관리 | 🟡 High | ⬜ | `app/(main)/settings/account/` | - |
| 7.5 | 테마/언어 설정 | 🟢 Medium | ⬜ | `app/(main)/settings/preferences/` | - |
| 7.6 | 알림 설정 페이지 | 🟢 Medium | ⬜ | `app/(main)/settings/notifications/` | - |

### 완료 조건

- [ ] 알림 목록 표시
- [ ] 알림 읽음/삭제 동작
- [ ] 프로필 수정 동작
- [ ] 테마 변경 동작

### 산출물

- `app/(main)/inbox/` - 수신함 페이지
- `app/(main)/settings/` - 설정 페이지들
- `components/settings/` - 설정 컴포넌트
- `lib/api/notification.ts` - 알림 API

### 의존성

- Week 1, 2 완료 필요

---

## Week 8: 구독 + 최적화 + QA

**목표**: 결제 연동 및 최종 마무리
**상태**: ⬜ 미시작
**진행률**: 0/7 (0%)

### 태스크

| # | 태스크 | 우선순위 | 상태 | 관련 파일 | 비고 |
|---|--------|---------|------|-----------|------|
| 8.1 | 구독 플랜 페이지 | 🟡 High | ⬜ | `app/(main)/settings/subscription/` | - |
| 8.2 | 결제 시스템 연동 | 🟡 High | ⬜ | `lib/api/payment.ts` | - |
| 8.3 | 성능 최적화 | 🟢 Medium | ⬜ | - | 코드 스플리팅, 이미지 최적화 |
| 8.4 | 반응형 대응 점검 | 🟢 Medium | ⬜ | - | 태블릿, 모바일 |
| 8.5 | 에러 핸들링 강화 | 🟡 High | ⬜ | `components/common/ErrorBoundary.tsx` | - |
| 8.6 | E2E 테스트 | 🟢 Medium | ⬜ | `tests/` | 주요 플로우 |
| 8.7 | 버그 수정 및 최종 QA | 🔴 Critical | ⬜ | - | - |

### 완료 조건

- [ ] 구독 페이지 동작
- [ ] Lighthouse 성능 점수 80+
- [ ] 주요 반응형 이슈 해결
- [ ] E2E 테스트 통과 (주요 플로우)
- [ ] 크리티컬 버그 0개

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
