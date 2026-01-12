# Tradex 프로젝트 현황

> **최종 업데이트**: 2024-12-31
> **현재 주차**: Week 1 (프로젝트 기반 구축)

---

## 1. 전체 진행 현황

### 1.1 요약

| 카테고리 | 완료 | 진행중 | 미시작 | 진행률 |
|----------|------|--------|--------|--------|
| 기획/스펙 | 0 | 9 | 0 | 0% |
| 페이지 구현 | 1 | 0 | 17 | 6% |
| 컴포넌트 | 0 | 0 | 30+ | 0% |
| API 연동 | 0 | 0 | 10+ | 0% |

### 1.2 로드맵 진행 현황

> 상세 내용은 [ROADMAP.md](./ROADMAP.md) 참조

| 주차 | 목표 | 상태 | 진행률 |
|------|------|------|--------|
| Week 1 | 프로젝트 기반 구축 | ✅ 완료 | 100% |
| Week 2 | 인증 시스템 | ⬜ 미시작 | 0% |
| Week 3 | 홈 대시보드 + Tradex AI | ⬜ 미시작 | 0% |
| Week 4 | 매매 관리 | ⬜ 미시작 | 0% |
| Week 5 | 차트 분석 | ⬜ 미시작 | 0% |
| Week 6 | 분석 + 수익 관리 | ⬜ 미시작 | 0% |
| Week 7 | 수신함 + 설정 | ⬜ 미시작 | 0% |
| Week 8 | 구독 + 최적화 + QA | ⬜ 미시작 | 0% |

### 1.3 마일스톤

| 마일스톤 | 상태 | 관련 주차 | 완료일 |
|----------|------|-----------|--------|
| 프로젝트 초기 설정 | ✅ 완료 | - | 2024-12-22 |
| 디자인 시스템 | ✅ 완료 | - | 2024-12-22 |
| 기획/스펙 문서화 | 🔄 진행중 | - | - |
| 개발 환경 구축 | 🔄 진행중 | Week 1 | - |
| 인증 기능 | ⬜ 미시작 | Week 2 | - |
| 핵심 기능 MVP | ⬜ 미시작 | Week 3-5 | - |
| 부가 기능 완성 | ⬜ 미시작 | Week 6-7 | - |
| 베타 출시 | ⬜ 미시작 | Week 8 | - |

---

## 2. 기획/스펙 문서 현황

### 상태 범례
- ⬜ `미작성`: 문서 미생성
- 📝 `작성중`: 초안 작성 중
- 🔍 `검토중`: 검토 대기
- ✅ `확정`: 최종 확정

| 모듈 | 스펙 문서 | 상태 | 비고 |
|------|----------|------|------|
| **Auth** | [specs/auth/README.md](./specs/auth/README.md) | 📝 작성중 | 소셜 로그인 제공자 확정 필요 |
| **Home** | [specs/home/README.md](./specs/home/README.md) | 📝 작성중 | - |
| **Tradex AI** | [specs/ai/README.md](./specs/ai/README.md) | 📝 작성중 | AI 모델 선정 필요 |
| **Inbox** | [specs/inbox/README.md](./specs/inbox/README.md) | 📝 작성중 | - |
| **Trading** | [specs/trading/README.md](./specs/trading/README.md) | 📝 작성중 | 거래소 연동 범위 확정 필요 |
| **Chart** | [specs/chart/README.md](./specs/chart/README.md) | 📝 작성중 | 차트 라이브러리 선정 필요 |
| **Analysis** | [specs/analysis/README.md](./specs/analysis/README.md) | 📝 작성중 | 리스크 계산식 확정 필요 |
| **Portfolio** | [specs/portfolio/README.md](./specs/portfolio/README.md) | 📝 작성중 | - |
| **Settings** | [specs/settings/README.md](./specs/settings/README.md) | 📝 작성중 | 결제 시스템 선정 필요 |

### 미결 사항

> 상세 내용은 [DECISIONS.md](./DECISIONS.md) 참조

| # | 항목 | 상태 | 우선순위 |
|---|------|------|----------|
| 1 | 소셜 로그인 제공자 | 🔴 미정 | 즉시 |
| 2 | 비밀번호 정책 | 🔴 미정 | 곧 |
| 3 | AI 모델 | 🔴 미정 | 곧 |
| 4 | 음성 입력 | 🔴 미정 | 나중 |
| 5 | 지원 거래소 | 🔴 미정 | 즉시 |
| 6 | 실시간 데이터 방식 | 🔴 미정 | 즉시 |
| 7 | 차트 라이브러리 | 🔴 미정 | 즉시 |
| 8 | 리스크 계산 공식 | 🔴 미정 | 나중 |
| 9 | 결제 시스템 | 🔴 미정 | 곧 |
| 10 | 구독 플랜 구성 | 🔴 미정 | 나중 |
| 11 | 지원 언어 | 🔴 미정 | 나중 |
| 12 | 알림 채널 | 🔴 미정 | 나중 |

---

## 3. 페이지 구현 현황

### 상태 범례
- ⬜ 미시작
- 🔄 진행중
- ✅ 완료
- 🚫 제외됨

### 3.1 Public 영역

| 페이지 | 경로 | 상태 | 담당자 | 비고 |
|--------|------|------|--------|------|
| 랜딩 페이지 | `/` | ✅ 완료 | - | 디자인 시스템 프리뷰 (임시) |

### 3.2 Auth 영역

| 페이지 | 경로 | 상태 | 담당자 | 비고 |
|--------|------|------|--------|------|
| 로그인 | `/auth/login` | ⬜ 미시작 | - | - |
| 회원가입 | `/auth/signup` | ⬜ 미시작 | - | - |
| 온보딩 | `/auth/onboarding` | ⬜ 미시작 | - | - |

### 3.3 Main 영역

| 페이지 | 경로 | 상태 | 담당자 | 비고 |
|--------|------|------|--------|------|
| 홈 (대시보드) | `/home` | ⬜ 미시작 | - | - |
| 수신함 | `/inbox` | ⬜ 미시작 | - | - |
| 알림 상세 | `/inbox/[id]` | ⬜ 미시작 | - | - |
| 매매 원칙 목록 | `/trading/principles` | ⬜ 미시작 | - | - |
| 원칙 등록 | `/trading/principles/new` | ⬜ 미시작 | - | - |
| 원칙 상세 | `/trading/principles/[id]` | ⬜ 미시작 | - | - |
| 매매일지 목록 | `/trading/journal` | ⬜ 미시작 | - | - |
| 일지 작성 | `/trading/journal/new` | ⬜ 미시작 | - | - |
| 일지 상세 | `/trading/journal/[id]` | ⬜ 미시작 | - | - |
| 차트 분석 | `/chart` | ⬜ 미시작 | - | - |
| 전략 분석 | `/analysis/strategy` | ⬜ 미시작 | - | - |
| 리스크 매핑 | `/analysis/risk` | ⬜ 미시작 | - | - |
| 자산 현황 | `/portfolio/assets` | ⬜ 미시작 | - | - |
| 손익 관리 | `/portfolio/pnl` | ⬜ 미시작 | - | - |
| 계정 설정 | `/settings/account` | ⬜ 미시작 | - | - |
| 기본 설정 | `/settings/preferences` | ⬜ 미시작 | - | - |
| 알림 설정 | `/settings/notifications` | ⬜ 미시작 | - | - |
| 구독 설정 | `/settings/subscription` | ⬜ 미시작 | - | - |

---

## 4. 컴포넌트 구현 현황

### 4.1 레이아웃 컴포넌트

| 컴포넌트 | 상태 | 의존 모듈 |
|----------|------|----------|
| Sidebar | ⬜ 미시작 | - |
| Header | ⬜ 미시작 | - |
| TradexAIPanel | ⬜ 미시작 | AI |
| MainLayout | ⬜ 미시작 | - |
| AuthLayout | ⬜ 미시작 | - |

### 4.2 기능별 컴포넌트

| 모듈 | 컴포넌트 | 상태 |
|------|----------|------|
| Auth | LoginForm | ⬜ 미시작 |
| Auth | SignupForm | ⬜ 미시작 |
| Auth | SocialLoginButtons | ⬜ 미시작 |
| Home | DashboardSummary | ⬜ 미시작 |
| Home | ProfitCard | ⬜ 미시작 |
| Home | RiskCard | ⬜ 미시작 |
| AI | ChatMessageList | ⬜ 미시작 |
| AI | ChatInput | ⬜ 미시작 |
| Inbox | NotificationList | ⬜ 미시작 |
| Trading | PrincipleForm | ⬜ 미시작 |
| Trading | JournalEditor | ⬜ 미시작 |
| Chart | ChartViewer | ⬜ 미시작 |
| Chart | TriggerForm | ⬜ 미시작 |
| Analysis | StrategyChart | ⬜ 미시작 |
| Analysis | RiskHeatmap | ⬜ 미시작 |
| Portfolio | AssetSummary | ⬜ 미시작 |
| Portfolio | PnLChart | ⬜ 미시작 |
| Settings | ProfileForm | ⬜ 미시작 |
| Settings | ThemeSelector | ⬜ 미시작 |

### 4.3 공통 UI 컴포넌트 (shadcn/ui)

| 컴포넌트 | 상태 | 비고 |
|----------|------|------|
| Button | ✅ 완료 | shadcn/ui |
| Input | ✅ 완료 | shadcn/ui |
| Dialog (Modal) | ✅ 완료 | shadcn/ui |
| Card | ✅ 완료 | shadcn/ui |
| Tabs | ✅ 완료 | shadcn/ui |
| Select | ✅ 완료 | shadcn/ui |
| Sonner (Toast) | ✅ 완료 | shadcn/ui |
| Label | ✅ 완료 | shadcn/ui |
| Textarea | ✅ 완료 | shadcn/ui |
| Badge | ✅ 완료 | shadcn/ui |
| Avatar | ✅ 완료 | shadcn/ui |
| Dropdown Menu | ✅ 완료 | shadcn/ui |
| Tooltip | ✅ 완료 | shadcn/ui |
| Sheet | ✅ 완료 | shadcn/ui |

---

## 5. API 연동 현황

| 도메인 | 엔드포인트 | 구현 상태 | 테스트 |
|--------|------------|----------|--------|
| Auth | `/auth/*` | ⬜ 미시작 | ⬜ |
| User | `/users/*` | ⬜ 미시작 | ⬜ |
| Dashboard | `/dashboard/*` | ⬜ 미시작 | ⬜ |
| Notification | `/notifications/*` | ⬜ 미시작 | ⬜ |
| Trading | `/trading/*` | ⬜ 미시작 | ⬜ |
| Chart | `/chart/*` | ⬜ 미시작 | ⬜ |
| Trigger | `/triggers/*` | ⬜ 미시작 | ⬜ |
| Analysis | `/analysis/*` | ⬜ 미시작 | ⬜ |
| Portfolio | `/portfolio/*` | ⬜ 미시작 | ⬜ |
| AI | `/ai/*` | ⬜ 미시작 | ⬜ |
| Subscription | `/subscription/*` | ⬜ 미시작 | ⬜ |

---

## 6. 인프라/설정 현황

| 항목 | 상태 | 비고 |
|------|------|------|
| Next.js 프로젝트 생성 | ✅ 완료 | v16 |
| TypeScript 설정 | ✅ 완료 | - |
| Tailwind CSS 설정 | ✅ 완료 | v4 |
| 디자인 시스템 (색상, 폰트) | ✅ 완료 | Pretendard |
| ESLint 설정 | ✅ 완료 | - |
| Zustand 설정 | ✅ 완료 | Auth, UI, Trading 스토어 |
| TanStack Query 설정 | ✅ 완료 | QueryProvider |
| shadcn/ui 설정 | ✅ 완료 | 14개 컴포넌트 |
| API 클라이언트 설정 | ✅ 완료 | axios, auth/trading API |
| 인증 미들웨어 | ⬜ 미시작 | - |
| CI/CD 설정 | ⬜ 미시작 | - |
| 환경변수 설정 | ⬜ 미시작 | - |

---

## 7. 변경 로그

| 날짜 | 변경 내용 |
|------|----------|
| 2024-12-31 | 8주 개발 로드맵 추가 (ROADMAP.md) |
| 2024-12-31 | 로드맵 연동 및 마일스톤 구조 개선 |
| 2024-12-22 | 프로젝트 초기 설정 완료 |
| 2024-12-22 | 디자인 시스템 (Pretendard, 색상 팔레트) 설정 |
| 2024-12-22 | 기획/스펙 문서 초안 작성 (9개 모듈) |
| 2024-12-22 | 아키텍처 문서 작성 |
| 2024-12-22 | 상태 문서 생성 |

---

## 8. 다음 작업 우선순위

### 즉시 필요
1. [ ] 미결 사항 확정 (소셜 로그인, AI 모델, 결제 시스템)
2. [ ] shadcn/ui 설치 및 기본 컴포넌트 설정
3. [ ] Zustand, TanStack Query 설정
4. [ ] 레이아웃 컴포넌트 구현 (Sidebar, Header)

### 단기
1. [ ] 인증 기능 구현 (로그인, 회원가입)
2. [ ] 메인 레이아웃 구현
3. [ ] 홈 대시보드 구현

### 중기
1. [ ] 차트 분석 기능
2. [ ] 매매일지 기능
3. [ ] Tradex AI 기능

---

*이 문서는 프로젝트 진행에 따라 지속적으로 업데이트됩니다.*
