# Tradex 아키텍처 문서

## 개요

이 문서는 Tradex 프로젝트의 페이지 구조, 디렉토리 설계, 라우팅 구조를 정의합니다.

---

## 1. 라우팅 구조

### 1.1 전체 라우트 맵

```
/                           # 랜딩 페이지 (비로그인)
│
├── /auth                   # 인증 관련
│   ├── /login             # 로그인
│   ├── /signup            # 회원가입
│   └── /onboarding        # 추가 정보 입력
│
├── /home                   # 대시보드 (메인)
│
├── /inbox                  # 수신함
│   └── /[id]              # 알림 상세
│
├── /trading                # 매매 관리
│   ├── /principles        # 매매 원칙
│   │   ├── /new          # 원칙 등록
│   │   └── /[id]         # 원칙 상세/수정
│   └── /journal           # 매매일지
│       ├── /new          # 일지 작성
│       └── /[id]         # 일지 상세/수정
│
├── /chart                  # 차트 분석
│   └── /[symbol]          # 종목별 차트
│
├── /analysis               # 분석
│   ├── /strategy          # 전략 분석
│   └── /risk              # 리스크 매핑
│
├── /portfolio              # 수익 관리
│   ├── /assets            # 자산 현황
│   └── /pnl               # 손익 관리
│
└── /settings               # 설정
    ├── /account           # 계정 설정
    ├── /preferences       # 기본 설정 (테마, 언어)
    ├── /notifications     # 알림 설정
    └── /subscription      # 구독 설정
```

### 1.2 라우트 그룹 설계

Next.js App Router의 Route Groups를 활용한 레이아웃 분리:

```
src/app/
├── (public)/               # 비로그인 접근 가능
│   ├── layout.tsx         # 퍼블릭 레이아웃
│   └── page.tsx           # 랜딩 페이지
│
├── (auth)/                 # 인증 페이지 (별도 레이아웃)
│   ├── layout.tsx         # 인증 레이아웃 (사이드바 없음)
│   ├── login/
│   ├── signup/
│   └── onboarding/
│
├── (main)/                 # 메인 서비스 (인증 필요)
│   ├── layout.tsx         # 메인 레이아웃 (사이드바 + AI 패널)
│   ├── home/
│   ├── inbox/
│   ├── trading/
│   ├── chart/
│   ├── analysis/
│   ├── portfolio/
│   └── settings/
│
├── layout.tsx              # 루트 레이아웃
├── globals.css
└── not-found.tsx
```

---

## 2. 디렉토리 구조

### 2.1 전체 구조

```
src/
├── app/                        # Next.js App Router
│   ├── (public)/
│   ├── (auth)/
│   ├── (main)/
│   ├── api/                   # API Routes (필요시)
│   ├── layout.tsx
│   ├── globals.css
│   └── not-found.tsx
│
├── components/                 # 컴포넌트
│   ├── ui/                    # 기본 UI (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   └── ...
│   │
│   ├── layout/                # 레이아웃 컴포넌트
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── SidebarNav.tsx
│   │   │   └── SidebarUser.tsx
│   │   ├── Header/
│   │   │   ├── Header.tsx
│   │   │   └── HeaderActions.tsx
│   │   ├── TradexAI/
│   │   │   ├── TradexAIPanel.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   └── ChatMessage.tsx
│   │   └── PageContainer.tsx
│   │
│   ├── features/              # 기능별 컴포넌트
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── SocialLoginButtons.tsx
│   │   ├── home/
│   │   │   ├── DashboardSummary.tsx
│   │   │   ├── QuickActions.tsx
│   │   │   └── RecentActivity.tsx
│   │   ├── inbox/
│   │   │   ├── NotificationList.tsx
│   │   │   └── NotificationItem.tsx
│   │   ├── trading/
│   │   │   ├── PrincipleCard.tsx
│   │   │   ├── PrincipleForm.tsx
│   │   │   ├── JournalEditor.tsx
│   │   │   └── JournalFilter.tsx
│   │   ├── chart/
│   │   │   ├── ChartViewer.tsx
│   │   │   ├── TradingSystem.tsx
│   │   │   ├── TriggerList.tsx
│   │   │   └── Indicators.tsx
│   │   ├── analysis/
│   │   │   ├── StrategyChart.tsx
│   │   │   ├── VariableSelector.tsx
│   │   │   └── RiskHeatmap.tsx
│   │   ├── portfolio/
│   │   │   ├── AssetSummary.tsx
│   │   │   ├── PnLChart.tsx
│   │   │   └── PositionList.tsx
│   │   └── settings/
│   │       ├── AccountForm.tsx
│   │       ├── ThemeSelector.tsx
│   │       ├── NotificationToggle.tsx
│   │       └── SubscriptionPlan.tsx
│   │
│   └── common/                # 공통 컴포넌트
│       ├── DataTable.tsx
│       ├── EmptyState.tsx
│       ├── LoadingSpinner.tsx
│       └── ErrorBoundary.tsx
│
├── lib/                        # 유틸리티
│   ├── api/                   # API 클라이언트
│   │   ├── client.ts
│   │   ├── auth.ts
│   │   ├── trading.ts
│   │   ├── chart.ts
│   │   └── ...
│   ├── utils/                 # 유틸 함수
│   │   ├── format.ts
│   │   ├── date.ts
│   │   └── validation.ts
│   └── constants/             # 상수
│       ├── routes.ts
│       └── config.ts
│
├── hooks/                      # 커스텀 훅
│   ├── useAuth.ts
│   ├── useTradexAI.ts
│   ├── useNotifications.ts
│   └── ...
│
├── stores/                     # Zustand 스토어
│   ├── useAuthStore.ts
│   ├── useUIStore.ts
│   ├── useTradingStore.ts
│   └── ...
│
├── types/                      # TypeScript 타입
│   ├── auth.types.ts
│   ├── trading.types.ts
│   ├── chart.types.ts
│   └── ...
│
└── styles/                     # 추가 스타일
    └── chart.css
```

### 2.2 페이지별 구조 예시

각 페이지 폴더 구조:

```
(main)/trading/journal/
├── page.tsx                # 매매일지 목록 페이지
├── loading.tsx             # 로딩 UI
├── error.tsx               # 에러 UI
├── new/
│   └── page.tsx           # 새 일지 작성
└── [id]/
    ├── page.tsx           # 일지 상세
    └── edit/
        └── page.tsx       # 일지 수정
```

---

## 3. 레이아웃 설계

### 3.1 레이아웃 구성

```
┌─────────────────────────────────────────────────────────────┐
│                         Header                              │
├────────┬────────────────────────────────┬───────────────────┤
│        │                                │                   │
│        │                                │                   │
│ Side   │         Main Content           │    Tradex AI      │
│ bar    │                                │    (Side Panel)   │
│        │                                │                   │
│        │                                │                   │
│        │                                │                   │
├────────┴────────────────────────────────┴───────────────────┤
│                      (Mobile: Bottom Nav)                   │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 레이아웃 컴포넌트 책임

| 컴포넌트 | 책임 |
|----------|------|
| `RootLayout` | 폰트, 전역 스타일, 프로바이더 |
| `AuthLayout` | 인증 페이지 전용 (센터 정렬, 로고) |
| `MainLayout` | 사이드바, 헤더, AI 패널 포함 |
| `Sidebar` | 네비게이션, 사용자 정보 |
| `Header` | 페이지 제목, 액션 버튼, 알림 |
| `TradexAIPanel` | AI 채팅 인터페이스 |

### 3.3 반응형 브레이크포인트

| 브레이크포인트 | 너비 | 레이아웃 변화 |
|--------------|------|--------------|
| Mobile | < 768px | 사이드바 숨김, 하단 네비게이션 |
| Tablet | 768px - 1024px | 사이드바 축소, AI 패널 오버레이 |
| Desktop | > 1024px | 전체 레이아웃 표시 |

---

## 4. 컴포넌트 네이밍 규칙

### 4.1 파일 네이밍

```
컴포넌트:     PascalCase.tsx      (Button.tsx, UserProfile.tsx)
훅:          useCamelCase.ts     (useAuth.ts, useTradingData.ts)
유틸:        camelCase.ts        (formatDate.ts, validateInput.ts)
타입:        camelCase.types.ts  (trading.types.ts)
상수:        UPPER_SNAKE.ts      (ROUTES.ts, CONFIG.ts)
```

### 4.2 컴포넌트 구조

```tsx
// 1. 타입 정의 (또는 별도 파일 import)
interface ComponentNameProps {
  prop1: string;
  prop2?: number;
}

// 2. 컴포넌트 정의
export function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  // 3. 훅 호출
  // 4. 상태 정의
  // 5. 핸들러 정의
  // 6. 렌더링
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

---

## 5. 데이터 흐름

### 5.1 상태 관리 전략

```
┌─────────────────────────────────────────────────────┐
│                    Server State                     │
│              (TanStack Query)                       │
│    - API 데이터 캐싱                                │
│    - 자동 리페치                                    │
│    - 로딩/에러 상태                                 │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                    Client State                     │
│                   (Zustand)                         │
│    - UI 상태 (사이드바, 모달)                       │
│    - 인증 상태                                      │
│    - 사용자 설정                                    │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                   Component State                   │
│                  (useState/useReducer)              │
│    - 폼 입력값                                      │
│    - 로컬 토글 상태                                 │
└─────────────────────────────────────────────────────┘
```

### 5.2 스토어 구조

```typescript
// stores/
├── useAuthStore.ts       // 인증, 사용자 정보
├── useUIStore.ts         // 사이드바, AI패널, 테마
├── useTradingStore.ts    // 현재 선택된 종목, 필터
└── useNotificationStore.ts // 알림 상태
```

---

## 6. 인증 & 권한

### 6.1 인증 플로우

```
비로그인 유저
    │
    ├── /auth/login ──────────────────┐
    │                                 │
    ├── /auth/signup ─────────────────┤
    │                                 ▼
    │                         회원가입/로그인 완료
    │                                 │
    │                                 ▼
    │                         신규 회원 여부 체크
    │                                 │
    │                    ┌────────────┴────────────┐
    │                    │                         │
    │               신규 회원                   기존 회원
    │                    │                         │
    │                    ▼                         │
    │           /auth/onboarding                   │
    │           (추가 정보 입력)                   │
    │                    │                         │
    └────────────────────┴─────────────────────────┘
                         │
                         ▼
                      /home
                   (대시보드)
```

### 6.2 미들웨어 보호

```typescript
// middleware.ts
const publicRoutes = ['/', '/auth/login', '/auth/signup'];
const authRoutes = ['/auth/login', '/auth/signup'];

// 1. 인증 필요 페이지 → 미인증 시 로그인으로 리다이렉트
// 2. 인증 완료 상태에서 로그인 페이지 접근 → 홈으로 리다이렉트
```

---

## 7. API 연동 구조

### 7.1 API 클라이언트

```typescript
// lib/api/client.ts
const apiClient = {
  get: <T>(url: string) => Promise<T>,
  post: <T>(url: string, data: unknown) => Promise<T>,
  put: <T>(url: string, data: unknown) => Promise<T>,
  delete: <T>(url: string) => Promise<T>,
};
```

### 7.2 도메인별 API

```
lib/api/
├── client.ts      # 기본 클라이언트
├── auth.ts        # 인증 (로그인, 회원가입, 토큰)
├── user.ts        # 사용자 (프로필, 설정)
├── trading.ts     # 매매 (원칙, 일지)
├── chart.ts       # 차트 (시세, 지표)
├── analysis.ts    # 분석 (전략, 리스크)
├── portfolio.ts   # 포트폴리오 (자산, 손익)
└── notification.ts # 알림
```

---

*마지막 업데이트: 2024*
