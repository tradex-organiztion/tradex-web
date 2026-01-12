# 홈 (대시보드) 기획/스펙 문서

> **상태**: `작성중`
> **최종 수정**: 2024-12-22
> **담당자**: -

---

## 1. 개요

### 1.1 목적
서비스 진입 시 사용자에게 핵심 정보를 한눈에 보여주고, 주요 기능으로의 빠른 접근을 제공합니다.

### 1.2 사용자 스토리
- As a 트레이더, I want to 수익 현황을 한눈에 확인, so that 전체 성과를 빠르게 파악할 수 있다.
- As a 트레이더, I want to AI 분석 바로가기, so that 빠르게 AI 인사이트를 얻을 수 있다.
- As a 트레이더, I want to 리스크 현황 확인, so that 위험 수준을 인지할 수 있다.

---

## 2. 기능 요구사항

### 2.1 필수 기능 (Must Have)
- [ ] 수익 요약 카드 (일간/주간/월간)
- [ ] AI 분석 바로가기
- [ ] 리스크 매핑 요약
- [ ] 최근 알림 목록
- [ ] 최근 매매일지 요약
- [ ] Tradex AI 사이드 패널 접근

### 2.2 선택 기능 (Nice to Have)
- [ ] 위젯 커스터마이징
- [ ] 대시보드 레이아웃 저장
- [ ] 실시간 가격 티커

### 2.3 제외 범위 (Out of Scope)
- 뉴스 피드
- 소셜 기능

---

## 3. 화면 설계

### 3.1 화면 목록

| 화면명 | 경로 | 설명 |
|--------|------|------|
| 대시보드 | `/home` | 메인 대시보드 |

### 3.2 화면 구성

```
┌─────────────────────────────────────────────────────────────┐
│ [Sidebar]  │          홈                    │ [AI Panel]   │
├────────────┼────────────────────────────────┼──────────────┤
│            │  ┌──────────┐ ┌──────────┐     │              │
│            │  │ 수익     │ │ 리스크   │     │              │
│            │  │ +12.5%   │ │ 중간     │     │              │
│            │  │ ₩1,234,567│ │ [맵]     │     │              │
│            │  └──────────┘ └──────────┘     │              │
│            │                                │              │
│            │  ┌─────────────────────────┐   │              │
│            │  │ AI 분석 보러가기 →      │   │              │
│            │  └─────────────────────────┘   │              │
│            │                                │              │
│            │  ┌─────────────────────────┐   │              │
│            │  │ 최근 알림               │   │              │
│            │  │ • 트리거 발동: AAPL     │   │              │
│            │  │ • 매매 원칙 알림        │   │              │
│            │  └─────────────────────────┘   │              │
│            │                                │              │
│            │  ┌─────────────────────────┐   │              │
│            │  │ 최근 매매일지           │   │              │
│            │  │ • BTC 롱 +5.2%          │   │              │
│            │  │ • ETH 숏 -2.1%          │   │              │
│            │  └─────────────────────────┘   │              │
└────────────┴────────────────────────────────┴──────────────┘
```

### 3.3 상태별 화면
- **기본 상태**: 데이터 표시
- **로딩 상태**: 스켈레톤 UI
- **빈 상태**: 시작 가이드 표시
- **에러 상태**: 재시도 버튼

---

## 4. 데이터 모델

### 4.1 주요 엔티티

```typescript
interface DashboardSummary {
  profit: {
    daily: number;
    weekly: number;
    monthly: number;
    totalAmount: number;
    percentChange: number;
  };
  risk: {
    level: 'low' | 'medium' | 'high';
    score: number;
  };
  recentNotifications: Notification[];
  recentJournals: JournalSummary[];
}

interface Notification {
  id: string;
  type: 'trigger' | 'principle' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface JournalSummary {
  id: string;
  symbol: string;
  position: 'long' | 'short';
  profitPercent: number;
  createdAt: string;
}
```

### 4.2 API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/dashboard/summary` | 대시보드 요약 데이터 |
| GET | `/notifications/recent` | 최근 알림 (5개) |
| GET | `/journals/recent` | 최근 매매일지 (5개) |

---

## 5. 비즈니스 로직

### 5.1 주요 로직
1. **수익 계산**: 기간별 실현손익 + 미실현손익 합산
2. **리스크 레벨**: 포지션 비율, 손실률 기반 계산
3. **자동 새로고침**: 1분 간격 데이터 갱신

### 5.2 유효성 검사
- N/A (읽기 전용 화면)

### 5.3 예외 처리
| 에러 코드 | 상황 | 대응 |
|----------|------|------|
| 500 | 서버 에러 | 캐시된 데이터 표시 + 재시도 |
| 503 | 서비스 점검 | 점검 안내 메시지 |

---

## 6. 컴포넌트 설계

### 6.1 컴포넌트 구조

```
components/features/home/
├── DashboardSummary.tsx
├── ProfitCard.tsx
├── RiskCard.tsx
├── AIActionCard.tsx
├── NotificationList.tsx
├── RecentJournalList.tsx
└── hooks/
    └── useDashboard.ts
```

### 6.2 Props 정의

```typescript
interface ProfitCardProps {
  daily: number;
  weekly: number;
  monthly: number;
  totalAmount: number;
}

interface RiskCardProps {
  level: 'low' | 'medium' | 'high';
  score: number;
  onClick?: () => void;
}
```

---

## 7. 상태 관리

### 7.1 로컬 상태
- 선택된 기간 탭 (일간/주간/월간)

### 7.2 전역 상태
- N/A

### 7.3 서버 상태 (TanStack Query)
```typescript
const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardSummary,
    refetchInterval: 60000, // 1분
  });
};
```

---

## 8. 의존성

### 8.1 내부 의존성
- `lib/api/dashboard.ts`
- `components/ui/Card`
- `components/layout/TradexAIPanel`

### 8.2 외부 의존성
- `recharts` 또는 차트 라이브러리 (미니 차트용)

---

## 9. 테스트 계획

### 9.1 단위 테스트
- [ ] 수익률 포맷팅
- [ ] 리스크 레벨 계산

### 9.2 통합 테스트
- [ ] 대시보드 데이터 로딩
- [ ] 자동 새로고침

### 9.3 E2E 테스트
- [ ] 홈 → AI 분석 이동
- [ ] 홈 → 알림 상세 이동

---

## 10. 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|----------|--------|
| 0.1 | 2024-12-22 | 초안 작성 | - |

---

## 11. 미결 사항 / 질문

- [ ] 위젯 순서 커스터마이징 필요 여부
- [ ] 실시간 데이터 갱신 주기 확정

---

## 12. 참고 자료

- [User Flow - 홈](../../USER_FLOW.md#31-홈-home)
- [Architecture](../../ARCHITECTURE.md)
