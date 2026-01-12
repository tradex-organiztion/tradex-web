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

### 폰트

- **Primary**: Pretendard Variable
- **CDN**: jsdelivr (layout.tsx에서 로드)

### 색상 팔레트

Tailwind CSS v4 `@theme inline`에서 정의됨 (`globals.css`)

#### Primary Colors

| 이름 | Tailwind Class | HEX |
|------|----------------|-----|
| Black | `bg-black` | #000000 |
| Black Light | `bg-black-light` | #323232 |
| White | `bg-white` | #FFFFFF |
| White Dark | `bg-white-dark` | #D7D7D7 |
| Gray 500 | `bg-gray-500` | #8F8F8F |
| Gray 300 | `bg-gray-300` | #C9C9C9 |
| Gray 200 | `bg-gray-200` | #DBDBDB |
| Navy 900 | `bg-navy-900` | #0F172A |
| Navy 700 | `bg-navy-700` | #475569 |
| Navy 500 | `bg-navy-500` | #666F8D |
| Navy 300 | `bg-navy-300` | #A7B0B9 |

#### System Colors

| 용도 | 500 (Main) | 300 | 200 | 100 (Light) |
|------|------------|-----|-----|-------------|
| Success | #13C34E | #B1DED6 | #CAF1D8 | #F8FCFB |
| Error | #FF0015 | #FBBEC3 | #FFC7CB | #FFF9F9 |
| Info | #0070FF | #BFDBFF | #E4EFFF | #FCFDFF |
| Warning | #FFF152 | #FEF9C2 | #FCFBF1 | #FFFEF7 |

#### 사용 예시

```tsx
// Primary colors
<div className="bg-navy-900 text-white">Navy Background</div>
<div className="text-gray-500">Muted Text</div>

// System colors
<span className="text-success-500">+12.5%</span>
<span className="text-error-500">-3.2%</span>
<div className="bg-info-100 text-info-500">Info Alert</div>
<div className="bg-warning-100 text-warning-500">Warning</div>

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

## API 연동 (예정)

API 서버 연동 시 다음 구조 참고:

```
src/lib/api/
├── client.ts      # API 클라이언트 설정
├── auth.ts        # 인증 API
├── trading.ts     # 매매 관련 API
├── chart.ts       # 차트 데이터 API
├── analysis.ts    # 분석 API
└── user.ts        # 사용자 API
```
