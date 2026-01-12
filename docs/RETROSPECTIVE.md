# Week 1 회고

> **작성일**: 2024-12-31
> **주차**: Week 1 - 프로젝트 기반 구축

---

## 1. 완료한 작업

| 태스크 | 산출물 | 비고 |
|--------|--------|------|
| shadcn/ui 설치 | 14개 UI 컴포넌트 | Button, Input, Card, Dialog 등 |
| Zustand 스토어 | 3개 스토어 | Auth, UI, Trading |
| TanStack Query + API | QueryProvider, API 클라이언트 | axios 기반 |
| 레이아웃 컴포넌트 | 5개 컴포넌트 | Sidebar, Header, MainLayout, AuthLayout, TradexAIPanel |
| 라우팅 구조 | 23개 페이지 | Auth 3개, Main 20개 |
| 공통 UI 컴포넌트 | 4개 컴포넌트 | Loading, Empty, ErrorMessage, PageHeader |

---

## 2. 잘된 점

### 2.1 체계적인 문서화
- ROADMAP.md와 STATUS.md 연동으로 진행 상황 실시간 추적
- 각 태스크 완료 시 즉시 문서 업데이트
- 컨텍스트 유지 지침(CLAUDE.md)으로 세션 간 연속성 확보

### 2.2 품질 검증
- 각 태스크 완료 시 `npm run build` 검증
- ESLint 검사 통과 확인
- 타입 안전성 유지

### 2.3 모듈화된 구조
- stores, api, components 명확히 분리
- index.ts를 통한 깔끔한 export
- 재사용 가능한 컴포넌트 설계

---

## 3. 개선한 점

### 3.1 `.env.example` 추가
**문제**: 환경변수 템플릿 누락
**해결**: `.env.example` 파일 생성

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_ENABLE_AI_CHAT=true
```

### 3.2 레이아웃 중복 제거
**문제**: 각 페이지에서 `MainLayout`을 개별적으로 import하여 중복 발생
**해결**:
- `(main)/layout.tsx`에서 통합 레이아웃 처리
- 각 페이지는 `PageHeader`만 사용하도록 간소화

**Before**:
```tsx
// 각 페이지마다 중복
import { MainLayout } from '@/components/layout'

export default function SomePage() {
  return (
    <MainLayout title="페이지 제목">
      <div>내용</div>
    </MainLayout>
  )
}
```

**After**:
```tsx
// layout.tsx에서 한 번만 처리
// 각 페이지는 간단하게
import { PageHeader } from '@/components/common'

export default function SomePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="페이지 제목" />
      <div>내용</div>
    </div>
  )
}
```

---

## 4. 배운 점

1. **레이아웃 설계 시 중복 고려**: Next.js App Router의 layout.tsx를 활용하면 페이지별 레이아웃 코드 중복을 피할 수 있음

2. **환경변수 템플릿 필수**: 프로젝트 초기에 `.env.example` 생성하여 필요한 환경변수 명시

3. **점진적 빌드 검증**: 각 기능 추가 후 빌드 검증으로 문제 조기 발견

---

## 5. Week 2 준비사항

### 차단 요소 확인
- [ ] 소셜 로그인 제공자 결정 필요 (DECISIONS.md #1)

### 사전 준비
- 인증 관련 스펙 문서 검토: `docs/specs/auth/README.md`
- OAuth 제공자 문서 확인 (Google, Apple)

---

## 6. 회고 체크리스트

- [x] 모든 태스크 완료 확인
- [x] 빌드 성공 확인
- [x] ESLint 통과 확인
- [x] 문서 업데이트 완료
- [x] 개선사항 반영 완료

---

*이 회고는 각 주차 완료 시 작성됩니다.*
