# Tradex 프로젝트 가이드

## 프로젝트 개요

Tradex는 AI 기반 트레이딩 분석 및 매매일지 관리 서비스입니다.

## 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS v4
- **상태 관리**: Zustand (예정)
- **데이터 페칭**: TanStack Query (예정)
- **UI 컴포넌트**: shadcn/ui (예정)
- **차트 라이브러리**: TradingView Lightweight Charts (예정)

## 디자인 시스템

> **Figma**: https://www.figma.com/design/bIuxiR3Mqy0PfLkxIQv4Oa

### ⚠️ 디자인 구현 원칙 (필수)

**Figma 디자인이 모든 UI 구현의 Single Source of Truth입니다.**

1. **Figma 우선**: 페이지/컴포넌트 구현 시 반드시 Figma 디자인을 먼저 확인
2. **라이브러리 기본값 무시**: shadcn/ui, Radix UI 등 라이브러리의 기본 스타일이 Figma와 다르면 **Figma 디자인대로 수정**
3. **스타일 충돌 시**: 라이브러리 기본값 vs Figma → **항상 Figma 우선**
4. **컴포넌트 재작성**: 필요시 라이브러리 컴포넌트를 Figma에 맞게 완전히 재작성

#### Figma 디자인 확인 워크플로우

```
1. 작업할 페이지의 Figma 노드 URL 확인
2. Figma MCP 도구로 디자인 컨텍스트 및 스크린샷 조회
3. 현재 구현과 Figma 디자인 비교
4. 차이점 식별 및 Figma 기준으로 수정
5. 스크린샷과 비교하여 검증
```

#### 예시: 잘못된 접근 vs 올바른 접근

```tsx
// ❌ 잘못된 접근: 라이브러리 기본 스타일 그대로 사용
<TabsList className="bg-muted rounded-lg p-1">
  <TabsTrigger>탭1</TabsTrigger>
</TabsList>

// ✅ 올바른 접근: Figma 디자인에 맞게 수정
<TabsList className="bg-transparent">
  <TabsTrigger className="h-[56px] border-b-2 data-[state=active]:border-[#131416]">
    탭1
  </TabsTrigger>
</TabsList>
```

### 폰트

- **Primary**: Pretendard Variable
- **CDN**: jsdelivr (layout.tsx에서 로드)
- **Line Height**: 1.4 (기본값)

### Typography

| 스타일 | 사이즈 | Weight | 클래스 |
|--------|--------|--------|--------|
| Display 1 | 64px | Bold(700) / Medium(500) / Regular(400) | `text-display-1-bold`, `text-display-1-medium`, `text-display-1-regular` |
| Display 2 | 48px | Bold(700) / Medium(500) / Regular(400) | `text-display-2-bold`, `text-display-2-medium`, `text-display-2-regular` |
| Title 1 | 24px | SemiBold(600) / Medium(500) / Regular(400) | `text-title-1-bold`, `text-title-1-medium`, `text-title-1-regular` |
| Title 2 | 20px | SemiBold(600) / Medium(500) / Regular(400) | `text-title-2-bold`, `text-title-2-medium`, `text-title-2-regular` |
| Body 1 | 16px | SemiBold(600) / Medium(500) / Regular(400) | `text-body-1-bold`, `text-body-1-medium`, `text-body-1-regular` |
| Body 2 | 14px | SemiBold(600) / Medium(500) / Regular(400) | `text-body-2-bold`, `text-body-2-medium`, `text-body-2-regular` |
| Caption | 12px | SemiBold(600) / Medium(500) / Regular(400) | `text-caption-bold`, `text-caption-medium`, `text-caption-regular` |

### 색상 팔레트

Tailwind CSS v4 `@theme inline`에서 정의됨 (`globals.css`)

#### Gray Colors

| 단계 | HEX | Tailwind Class |
|------|-----|----------------|
| 0 | #FFFFFF | `bg-gray-0`, `text-gray-0` |
| 50 | #F4F5F6 | `bg-gray-50`, `text-gray-50` |
| 100 | #E6E8EA | `bg-gray-100`, `text-gray-100` |
| 200 | #CDD1D5 | `bg-gray-200`, `text-gray-200` |
| 300 | #8A949E | `bg-gray-300`, `text-gray-300` |
| 400 | #6D7882 | `bg-gray-400`, `text-gray-400` |
| 500 | #58616A | `bg-gray-500`, `text-gray-500` |
| 600 | #464C53 | `bg-gray-600`, `text-gray-600` |
| 700 | #1E2124 | `bg-gray-700`, `text-gray-700` |
| 800 | #131416 | `bg-gray-800`, `text-gray-800` |
| 900 | #000000 | `bg-gray-900`, `text-gray-900` |

#### System Colors

| 용도 | 400 (Main) | 300 | 200 | 100 (Light) |
|------|------------|-----|-----|-------------|
| Green (Success) | #13C34E | #5FD98B | #A8EAC0 | #E7F8ED |
| Red (Error) | #FF0015 | #FF4D5E | #FF9AA3 | #FFE6E8 |
| Blue (Info) | #0070FF | #BFDBFF | #E4EFFF | #FCFDFF |
| Yellow (Warning) | #FEC700 | #FFE066 | #FFED99 | #FFF8D6 |

#### Symbol Colors

| 이름 | HEX | Tailwind Class |
|------|-----|----------------|
| Main | #0FDD99 | `bg-symbol-main`, `text-symbol-main` |
| Sub | #9FF91E | `bg-symbol-sub`, `text-symbol-sub` |

#### Element Colors (UI 요소용 시맨틱 색상)

primary/secondary를 element로 통합하고, positive·danger·warning·info 상태를 추가한 시맨틱 색상 시스템입니다.

| 이름 | 참조 값 | Tailwind Class |
|------|---------|----------------|
| primary-default | gray-800 | `bg-element-primary-default`, `text-element-primary-default` |
| primary-pressed | gray-700 | `bg-element-primary-pressed` |
| primary-disabled | gray-100 | `bg-element-primary-disabled` |
| secondary-default | gray-0 | `bg-element-secondary-default` |
| secondary-pressed | gray-100 | `bg-element-secondary-pressed` |
| secondary-disabled | gray-200 | `bg-element-secondary-disabled` |
| positive-default | green-400 | `bg-element-positive-default`, `text-element-positive-default` |
| positive-lighter | green-100 | `bg-element-positive-lighter` |
| danger-default | red-400 | `bg-element-danger-default`, `text-element-danger-default` |
| danger-lighter | red-100 | `bg-element-danger-lighter` |
| warning-default | yellow-400 | `bg-element-warning-default`, `text-element-warning-default` |
| warning-lighter | yellow-100 | `bg-element-warning-lighter` |
| info-default | blue-400 | `bg-element-info-default`, `text-element-info-default` |
| info-lighter | blue-100 | `bg-element-info-lighter` |

#### Label Colors (텍스트/라벨용 시맨틱 색상)

텍스트와 라벨에 사용되는 시맨틱 색상 시스템입니다.

| 이름 | 참조 값 | Tailwind Class | 용도 |
|------|---------|----------------|------|
| normal | gray-800 | `text-label-normal` | 기본 텍스트 |
| neutral | gray-600 | `text-label-neutral` | 보조 텍스트 |
| assistive | gray-400 | `text-label-assistive` | 부가 설명, 힌트 |
| disabled | gray-300 | `text-label-disabled` | 비활성화 텍스트 |
| inverse | gray-0 | `text-label-inverse` | 어두운 배경 위 텍스트 |
| positive | green-400 | `text-label-positive` | 긍정적 상태 (수익, 성공) |
| danger | red-400 | `text-label-danger` | 위험 상태 (손실, 에러) |
| warning | yellow-400 | `text-label-warning` | 경고 상태 |
| info | blue-400 | `text-label-info` | 정보 상태 |

#### Line Colors (보더/구분선용 시맨틱 색상)

보더와 구분선에 사용되는 시맨틱 색상 시스템입니다.

| 이름 | 참조 값 | Tailwind Class | 용도 |
|------|---------|----------------|------|
| normal | gray-200 | `border-line-normal` | 기본 보더 |
| focused | gray-400 | `border-line-focused` | 포커스 상태 |
| primary | gray-800 | `border-line-primary` | 강조 보더 |
| **positive** | green-400 | `border-line-positive` | 긍정적 상태 |
| **danger** | red-400 | `border-line-danger` | 위험 상태 |
| **warning** | yellow-400 | `border-line-warning` | 경고 상태 |
| **info** | blue-400 | `border-line-info` | 정보 상태 |

### Shadow

| 이름 | 값 | 클래스 |
|------|-----|--------|
| Normal | 0px 0px 8px rgba(0,0,0,0.1) | `shadow-normal` |
| Emphasize | 0px 0px 12px rgba(0,0,0,0.1) | `shadow-emphasize` |
| Strong | 0px 0px 16px rgba(0,0,0,0.1) | `shadow-strong` |
| Heavy | 0px 0px 24px rgba(0,0,0,0.1) | `shadow-heavy` |

### Grid System

| 디바이스 | 너비 | Columns | Margin | Gutter |
|----------|------|---------|--------|--------|
| Desktop | 1920px | 12 | 40px | 24px |
| Tablet | 1024px | 6 | 24px | 16px |
| Mobile | ~412px | 4 | 16px | 16px |

### 사용 예시

```tsx
// Typography
<h1 className="text-display-1-bold">대제목</h1>
<h2 className="text-title-1-medium">중제목</h2>
<p className="text-body-1-regular">본문 텍스트</p>
<span className="text-caption-medium">캡션</span>

// Gray colors
<div className="bg-gray-50 text-gray-900">Light Background</div>
<div className="bg-gray-800 text-gray-0">Dark Background</div>

// System colors
<span className="text-green-400">+12.5%</span>
<span className="text-red-400">-3.2%</span>
<div className="bg-blue-100 text-blue-400">Info Alert</div>
<div className="bg-yellow-100 text-yellow-400">Warning</div>

// Symbol colors
<span className="text-symbol-main">Symbol Main</span>
<span className="text-symbol-sub">Symbol Sub</span>

// Element colors (UI 요소용)
<button className="bg-element-primary-default hover:bg-element-primary-pressed">Primary Button</button>
<button className="bg-element-secondary-default hover:bg-element-secondary-pressed border">Secondary Button</button>
<span className="bg-element-positive-lighter text-element-positive-default">+12.5%</span>
<span className="bg-element-danger-lighter text-element-danger-default">-3.2%</span>
<div className="bg-element-warning-lighter text-element-warning-default">Warning Badge</div>
<div className="bg-element-info-lighter text-element-info-default">Info Badge</div>

// Label colors (텍스트용)
<p className="text-label-normal">기본 텍스트</p>
<p className="text-label-neutral">보조 텍스트</p>
<p className="text-label-assistive">부가 설명</p>
<span className="text-label-positive">+12.5%</span>
<span className="text-label-danger">-3.2%</span>
<span className="text-label-warning">경고</span>
<span className="text-label-info">정보</span>
<div className="bg-gray-800 text-label-inverse">어두운 배경 위 텍스트</div>

// Line colors (보더/구분선용)
<div className="border border-line-normal">기본 보더</div>
<input className="border border-line-normal focus:border-line-focused" />
<div className="border-2 border-line-primary">강조 보더</div>
<div className="border border-line-positive">성공 상태</div>
<div className="border border-line-danger">에러 상태</div>

// Shadows
<div className="shadow-normal rounded-xl">Normal Shadow</div>
<div className="shadow-heavy rounded-xl">Heavy Shadow</div>

// Semantic colors
<div className="bg-background text-foreground">Default</div>
<div className="text-primary">Primary Text</div>
<div className="border-border">Bordered Box</div>
```

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 인증 관련 라우트 그룹
│   │   ├── login/
│   │   ├── signup/
│   │   └── additional-info/
│   ├── (main)/            # 메인 서비스 라우트 그룹
│   │   ├── home/          # 대시보드
│   │   ├── inbox/         # 수신함
│   │   ├── trading/       # 매매 등록/일지
│   │   ├── chart/         # 차트분석
│   │   ├── analysis/      # 전략/리스크 분석
│   │   ├── portfolio/     # 수익 관리
│   │   └── settings/      # 설정
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/            # 공통 컴포넌트
│   ├── ui/               # shadcn/ui 컴포넌트
│   ├── layout/           # 레이아웃 컴포넌트
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── TradexAISide.tsx
│   ├── chart/            # 차트 관련 컴포넌트
│   ├── trading/          # 매매 관련 컴포넌트
│   └── common/           # 공통 UI 컴포넌트
│
├── lib/                  # 유틸리티 및 설정
│   ├── api/             # API 클라이언트
│   ├── utils/           # 유틸리티 함수
│   └── constants/       # 상수 정의
│
├── hooks/               # 커스텀 훅
│
├── stores/              # Zustand 스토어
│
├── types/               # TypeScript 타입 정의
│
└── styles/              # 추가 스타일
```

## 핵심 문서

| 문서 | 경로 | 설명 |
|------|------|------|
| **개발 로드맵** | `docs/ROADMAP.md` | 8주 개발 로드맵, 주차별 태스크 |
| 유저 플로우 | `docs/USER_FLOW.md` | 전체 서비스 플로우 및 기능 명세 |
| 아키텍처 | `docs/ARCHITECTURE.md` | 페이지 구조, 디렉토리 설계, 라우팅 |
| 프로젝트 현황 | `docs/STATUS.md` | 구현 현황, 진행 상태 추적 |
| **미결 사항** | `docs/DECISIONS.md` | 확정 필요한 의사결정 사항 |
| **CI/CD** | `docs/CICD.md` | 배포 파이프라인, Docker, GitHub Actions |
| 회고 | `docs/RETROSPECTIVE.md` | 주차별 회고 및 개선사항 |
| 스펙 문서 | `docs/specs/` | 기능별 기획/스펙 문서 |

### 스펙 문서 목록

| 모듈 | 경로 | 상태 |
|------|------|------|
| 인증 | `docs/specs/auth/README.md` | 작성중 |
| 홈 | `docs/specs/home/README.md` | 작성중 |
| Tradex AI | `docs/specs/ai/README.md` | 작성중 |
| 수신함 | `docs/specs/inbox/README.md` | 작성중 |
| 매매 관리 | `docs/specs/trading/README.md` | 작성중 |
| 차트 분석 | `docs/specs/chart/README.md` | 작성중 |
| 분석 | `docs/specs/analysis/README.md` | 작성중 |
| 수익 관리 | `docs/specs/portfolio/README.md` | 작성중 |
| 설정 | `docs/specs/settings/README.md` | 작성중 |

## 주요 기능 모듈

### 1. 인증 (Auth)
- 소셜 로그인 (Google, Apple)
- 기본 로그인 (이메일/비밀번호)
- 추가 정보 입력 (신규 회원)

### 2. Tradex AI
- 채팅 기반 AI 분석
- 이미지/파일 업로드 분석
- 음성 입력 지원
- 사이드 패널 형태로 전역 접근 가능

### 3. 매매 관리
- 매매 원칙 등록/수정
- AI 매매 원칙 추천
- 매매일지 작성 및 복기
- 필터링 (기간, 포지션, 수익/손실)

### 4. 차트 분석
- 기본 차트 기능 (캔들, 지표)
- Trading System (트리거 설정)
- AI 차트 분석 연동

### 5. 분석
- 전략 분석 (변수별 성과)
- 리스크 매핑

### 6. 수익 관리
- Assets (자산 현황)
- P&L (손익 관리)

### 7. 설정
- 계정 설정 (프로필, 거래소 API)
- 테마/언어 설정
- 알림 설정
- 구독 관리

## 코딩 컨벤션

### 파일 네이밍
- 컴포넌트: `PascalCase.tsx`
- 유틸리티: `camelCase.ts`
- 타입: `camelCase.types.ts`
- 훅: `useCamelCase.ts`

### 컴포넌트 작성 패턴

```tsx
// 함수형 컴포넌트 + TypeScript
interface ComponentProps {
  title: string;
  onClick?: () => void;
}

export function Component({ title, onClick }: ComponentProps) {
  return (
    <div onClick={onClick}>
      {title}
    </div>
  );
}
```

### API 연동 패턴

```typescript
// src/lib/api/[domain].ts
import { apiClient } from './client';

export interface Entity {
  id: string;
  name: string;
}

export const entityApi = {
  getAll: async (): Promise<Entity[]> => {
    return apiClient.get<Entity[]>('/entities');
  },

  getById: async (id: string): Promise<Entity> => {
    return apiClient.get<Entity>(`/entities/${id}`);
  },
};
```

### API 에러 처리 패턴 (필수)

API 호출 시 반드시 상황에 맞는 에러 메시지를 표시해야 합니다.

#### 에러 유형별 메시지

| 에러 상황 | 메시지 예시 |
|----------|------------|
| Network Error (서버 연결 불가) | "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요." |
| 401 Unauthorized | 상황에 맞는 메시지 (예: "이메일 또는 비밀번호가 올바르지 않습니다.") |
| 404 Not Found | 상황에 맞는 메시지 (예: "등록되지 않은 이메일입니다.") |
| 서버 에러 메시지 존재 | 서버에서 보낸 메시지 표시 |
| 기타 에러 | 일반적인 실패 메시지 |

#### 에러 처리 코드 패턴

```typescript
// 폼 제출 등 사용자 인터랙션이 있는 API 호출
try {
  const response = await someApi.action(data)
  // 성공 처리
} catch (err: unknown) {
  console.warn("Action error:", err) // console.error 대신 console.warn 사용 (Next.js dev overlay 방지)

  if (err && typeof err === "object") {
    const axiosError = err as {
      response?: { status?: number; data?: { message?: string } }
      message?: string
    }

    // Network Error (서버 연결 불가)
    if (axiosError.message === "Network Error" || !axiosError.response) {
      setError("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.")
    } else if (axiosError.response?.status === 401) {
      setError("인증에 실패했습니다.") // 상황에 맞게 수정
    } else if (axiosError.response?.status === 404) {
      setError("요청한 리소스를 찾을 수 없습니다.") // 상황에 맞게 수정
    } else if (axiosError.response?.data?.message) {
      setError(axiosError.response.data.message)
    } else {
      setError("작업에 실패했습니다. 다시 시도해주세요.")
    }
  } else {
    setError("작업에 실패했습니다. 다시 시도해주세요.")
  }
}
```

```typescript
// 페이지 로드 시 데이터 fetching (useEffect 내)
useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true)

    // .catch() 패턴 사용 (try-catch 대신) - Next.js dev overlay 방지
    const data = await someApi.getData().catch((err) => {
      console.warn("Data fetch error:", err.message)
      return null
    })

    if (data) {
      setData(data)
    } else {
      setError("서버에 연결할 수 없습니다.")
      // 또는 기본 데이터 표시
    }

    setIsLoading(false)
  }

  fetchData()
}, [])
```

#### 주요 원칙

1. **console.error → console.warn**: Next.js 개발 모드에서 error overlay가 뜨지 않도록 `console.warn` 사용
2. **Network Error 우선 체크**: `axiosError.message === "Network Error"` 또는 `!axiosError.response`로 서버 연결 불가 상태 먼저 확인
3. **상황별 맞춤 메시지**: 401, 404 등 HTTP 상태 코드에 따라 사용자가 이해하기 쉬운 메시지 제공
4. **서버 메시지 활용**: `axiosError.response?.data?.message`가 있으면 서버가 제공하는 메시지 표시
5. **데이터 fetching은 .catch() 패턴**: useEffect 내 API 호출은 `.catch()`로 처리하여 에러 시 null 반환

### 상태 관리 패턴 (Zustand)

```typescript
// src/stores/useExampleStore.ts
import { create } from 'zustand';

interface ExampleState {
  data: string;
  setData: (data: string) => void;
}

export const useExampleStore = create<ExampleState>((set) => ({
  data: '',
  setData: (data) => set({ data }),
}));
```

## 개발 명령어

```bash
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 검사
```

## 배포

프로젝트는 Git 브랜치 기반 자동 배포가 설정되어 있습니다.

| 브랜치 | 배포 환경 | 플랫폼 |
|--------|----------|--------|
| `develop` | 개발 | AWS Amplify (dev) |
| `main` | 프로덕션 | AWS Amplify (prod) |

### 배포 프로세스

사용자가 "배포해줘"라고 요청하면 다음 단계를 수행합니다:

```bash
# 1. develop 브랜치에 커밋 및 푸시 (개발 환경 자동 배포)
git add .
git commit -m "커밋 메시지"
git push origin develop

# 2. main 브랜치에 merge 및 푸시 (프로덕션 자동 배포)
git checkout main
git pull origin main
git merge develop
git push origin main
git checkout develop
```

### 주의사항

- 배포 전 반드시 `npm run build`로 빌드 성공 여부 확인
- main merge는 Production 배포이므로 신중하게 진행

## 작업 시 참고사항

1. **로드맵 확인**: 작업 시작 전 `docs/ROADMAP.md`에서 현재 주차 태스크 확인
2. **스펙 문서 확인**: 기능 구현 전 `docs/specs/[모듈]/README.md` 확인
3. **유저 플로우 확인**: 전체 플로우는 `docs/USER_FLOW.md` 참조
4. **현황 업데이트**: 작업 완료 시 `docs/STATUS.md` 및 `docs/ROADMAP.md` 상태 업데이트
5. **컴포넌트 재사용**: 기존 컴포넌트 확인 후 필요시 새로 생성
6. **타입 안전성**: 모든 Props와 API 응답에 타입 정의
7. **Tailwind CSS**: 인라인 스타일 대신 Tailwind 클래스 사용
8. **App Router**: 서버 컴포넌트 우선, 필요시 'use client' 사용
9. **미결 사항**: 스펙 문서의 미결 사항 섹션 확인 후 작업
10. **API 작업**: API 관련 작업 시 `https://api.tradex.so/v3/api-docs`에서 최신 스펙 실시간 조회

## 로드맵 트래킹 워크플로우

### 태스크 시작 시
1. `docs/ROADMAP.md`에서 해당 태스크 상태를 `⬜` → `🔄`로 변경
2. 작업 시작

### 태스크 완료 시
1. `docs/ROADMAP.md`에서 해당 태스크 상태를 `🔄` → `✅`로 변경
2. 주차별 진행률 업데이트 (예: 2/6 → 3/6)
3. `docs/STATUS.md`의 관련 항목 업데이트

### 주차 완료 시
1. 상단 요약 테이블의 상태 및 진행률 업데이트
2. 다음 주차 상태를 `🔄 진행중`으로 변경
3. `docs/STATUS.md`의 로드맵 진행 현황 업데이트

## 컨텍스트 유지 지침

대화가 끊기거나 새 세션이 시작되어도 작업을 이어갈 수 있도록 다음 원칙을 따릅니다.

### 핵심 원칙

1. **모든 작업 상태는 문서에 기록**: 메모리가 아닌 파일에 저장
2. **ROADMAP.md가 Single Source of Truth**: 현재 진행 중인 태스크 확인 가능
3. **작업 로그 유지**: 완료된 작업과 다음 할 일 명시

### 새 세션 시작 시 확인 순서

```
1. docs/ROADMAP.md → 현재 주차, 진행 중인 태스크 확인
2. docs/STATUS.md → 전체 현황 파악
3. docs/DECISIONS.md → 미결 사항 확인 (차단 요소)
4. 해당 주차의 관련 스펙 문서 확인
```

### 작업 중 문서화 규칙

#### 태스크 시작 시
```markdown
# ROADMAP.md 해당 태스크
| 1.1 | shadcn/ui 설치 | 🔴 Critical | 🔄 | `components/ui/` | 진행중 |
```

#### 태스크 진행 중 (중간 저장)
복잡한 태스크의 경우 ROADMAP.md 비고란에 진행 상황 기록:
```markdown
| 1.1 | shadcn/ui 설치 | 🔴 Critical | 🔄 | `components/ui/` | Button, Input 완료. Card 진행중 |
```

#### 태스크 완료 시
```markdown
| 1.1 | shadcn/ui 설치 | 🔴 Critical | ✅ | `components/ui/` | 완료 (Button, Input, Card, Modal, Tabs) |
```

### 인수인계 형식

세션 종료 시 또는 요청 시 다음 형식으로 현황 정리:

```markdown
## 현재 작업 현황

### 완료된 작업
- [x] Week 1-1: shadcn/ui 설치 (Button, Input, Card, Modal, Tabs)

### 진행 중인 작업
- [ ] Week 1-2: Zustand 스토어 구조 설정
  - useAuthStore 완료
  - useUIStore 진행중

### 다음 작업
- Week 1-3: TanStack Query 설정

### 차단 요소
- 없음 (또는 구체적인 차단 요소 명시)
```

### 파일 구조 변경 시

새 파일/폴더 생성 시 관련 문서 업데이트:
1. `CLAUDE.md` - 프로젝트 구조 섹션
2. `docs/STATUS.md` - 컴포넌트/페이지 현황
3. `docs/ARCHITECTURE.md` - 필요시

## 의사결정 업데이트 워크플로우

사용자가 미결 사항에 대한 확정 내용을 전달하면 다음 프로세스를 따릅니다.

### 트리거

사용자가 다음과 같이 의사결정을 전달할 때:
- "소셜 로그인은 Google + Kakao로 결정"
- "AI 모델은 GPT-4o 사용"
- "차트 라이브러리는 Lightweight Charts로"

### 업데이트 프로세스

#### 1단계: DECISIONS.md 업데이트
```markdown
#### 결정
- 결정: [결정 내용]
- 결정일: [오늘 날짜]
- 결정자: 사용자
- 사유: [사용자가 언급한 사유 또는 "-"]
```
- 해당 항목 상태를 `🔴 미정` → `🟢 확정`으로 변경
- 결정 요약 테이블도 함께 업데이트

#### 2단계: STATUS.md 업데이트
- 미결 사항 테이블의 해당 항목 상태 변경
- `🔴 미정` → `🟢 확정`

#### 3단계: 관련 스펙 문서 업데이트
각 결정에 따라 영향받는 스펙 문서 수정:

| 결정 항목 | 영향받는 스펙 |
|----------|--------------|
| 소셜 로그인 | `specs/auth/README.md` |
| 비밀번호 정책 | `specs/auth/README.md` |
| AI 모델 | `specs/ai/README.md` |
| 음성 입력 | `specs/ai/README.md` |
| 지원 거래소 | `specs/trading/README.md`, `specs/chart/README.md`, `specs/portfolio/README.md` |
| 실시간 데이터 | `specs/chart/README.md` |
| 차트 라이브러리 | `specs/chart/README.md`, `CLAUDE.md` (기술 스택) |
| 리스크 공식 | `specs/analysis/README.md` |
| 결제 시스템 | `specs/settings/README.md` |
| 구독 플랜 | `specs/settings/README.md` |
| 지원 언어 | 전체 스펙 |
| 알림 채널 | `specs/inbox/README.md`, `specs/settings/README.md` |

#### 4단계: CLAUDE.md 업데이트 (필요시)
기술 스택 관련 결정인 경우:
- 차트 라이브러리 → 기술 스택 섹션 업데이트
- AI 모델 → 기술 스택에 추가

#### 5단계: 완료 보고
업데이트된 파일 목록과 주요 변경 내용 요약 제공

### 의사결정 항목 참조

| # | 항목 | 관련 문서 |
|---|------|----------|
| 1 | 소셜 로그인 제공자 | DECISIONS.md, specs/auth |
| 2 | 비밀번호 정책 | DECISIONS.md, specs/auth |
| 3 | AI 모델 | DECISIONS.md, specs/ai, CLAUDE.md |
| 4 | 음성 입력 | DECISIONS.md, specs/ai |
| 5 | 지원 거래소 | DECISIONS.md, specs/trading, specs/chart, specs/portfolio |
| 6 | 실시간 데이터 방식 | DECISIONS.md, specs/chart |
| 7 | 차트 라이브러리 | DECISIONS.md, specs/chart, CLAUDE.md |
| 8 | 리스크 계산 공식 | DECISIONS.md, specs/analysis |
| 9 | 결제 시스템 | DECISIONS.md, specs/settings |
| 10 | 구독 플랜 구성 | DECISIONS.md, specs/settings |
| 11 | 지원 언어 | DECISIONS.md, 전체 스펙 |
| 12 | 알림 채널 | DECISIONS.md, specs/inbox, specs/settings |

---

## API 연동

### API 문서 (Swagger)

> **중요**: API 관련 작업 시 반드시 최신 API 문서를 실시간으로 확인할 것
>
> **필수 규칙**: "API Docs 기준", "API 문서 기준", "현재 API 기준" 등의 표현이 나오면 **반드시 Swagger(OpenAPI Spec)를 WebFetch로 조회**하여 실제 존재하는 API만 기준으로 분석할 것. 코드에 정의된 API 함수가 아닌, Swagger에 실제로 존재하는 엔드포인트만 "구현 가능"으로 판단해야 함.

| 항목 | 값 |
|------|-----|
| Swagger UI | https://api.tradex.so/swagger-ui/index.html#/ |
| OpenAPI Spec | https://api.tradex.so/v3/api-docs |
| Base URL | https://api.tradex.so |
| 인증 방식 | Bearer Token (JWT) |

### API 작업 시 워크플로우

API 연동, 수정, 디버깅 등 API 관련 작업을 수행할 때:

1. **최신 API 스펙 조회**: `https://api.tradex.so/v3/api-docs` URL을 WebFetch로 호출하여 최신 OpenAPI 스펙 확인
2. **엔드포인트 확인**: 필요한 엔드포인트의 path, method, request/response 스키마 파악
3. **타입 정의**: API 스펙에 맞춰 TypeScript 타입 정의
4. **구현**: API 클라이언트 함수 구현

```typescript
// API 문서 조회 예시 (Claude가 수행)
// WebFetch: https://api.tradex.so/v3/api-docs
// → 최신 엔드포인트, 스키마 정보 획득
```

### API 파일 구조

```
src/lib/api/
├── client.ts      # API 클라이언트 설정 (axios instance, interceptors)
├── auth.ts        # 인증 API (login, signup, refresh, logout)
├── trading.ts     # 매매 관련 API
├── chart.ts       # 차트 데이터 API
├── analysis.ts    # 분석 API
├── portfolio.ts   # 포트폴리오 API
├── notification.ts # 알림 API
└── user.ts        # 사용자 API
```

### 현재 확인된 API 엔드포인트

> 아래는 참고용이며, 실제 작업 시에는 반드시 실시간으로 API 문서를 조회할 것

#### 인증 (Auth)
| Method | Path | 설명 |
|--------|------|------|
| POST | `/api/auth/signup` | 회원가입 |
| POST | `/api/auth/login` | 로그인 |
| POST | `/api/auth/refresh` | 토큰 갱신 |
| POST | `/api/auth/logout` | 로그아웃 |
| POST | `/api/auth/complete-profile` | 프로필 완성 (거래소 API 등록) |
| GET | `/api/auth/me` | 현재 사용자 정보 |

---

## CI/CD 및 배포

> **상세 문서**: `docs/CICD.md` 참조

### 브랜치 전략

| 브랜치 | 용도 | 배포 환경 |
|--------|------|----------|
| `main` | 프로덕션 릴리즈 | AWS Amplify (prod) |
| `develop` | 개발/스테이징 | AWS Amplify (dev) |
| `feature/*` | 기능 개발 | - |
| `fix/*` | 버그 수정 | - |

### 배포 플로우

```
develop push → AWS Amplify 개발 환경 자동 배포
main push    → AWS Amplify 프로덕션 자동 배포
```

### develop → main Merge 작업

사용자가 "main에 develop merge 해줘" 또는 유사한 요청을 하면 다음 명령어를 순차 실행:

```bash
git checkout main
git pull origin main
git merge develop
git push origin main
git checkout develop
```

### 배포 작업 시 주의사항

1. **develop 브랜치에서 작업**: 기능 개발은 `develop` 또는 `feature/*` 브랜치에서 진행
2. **빌드 확인**: merge 전 `npm run build`로 빌드 확인 권장
