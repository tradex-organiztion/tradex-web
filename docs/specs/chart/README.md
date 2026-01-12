# 차트 분석 (Chart) 기획/스펙 문서

> **상태**: `작성중`
> **최종 수정**: 2024-12-22
> **담당자**: -

---

## 1. 개요

### 1.1 목적
트레이딩 차트 분석 및 트리거 시스템을 통해 매매 기회를 포착합니다.

### 1.2 사용자 스토리
- As a 트레이더, I want to 차트 분석, so that 매매 결정을 내릴 수 있다.
- As a 트레이더, I want to 트리거 설정, so that 조건 충족 시 알림을 받을 수 있다.
- As a 트레이더, I want to AI 차트 분석, so that 전문적인 인사이트를 얻을 수 있다.

---

## 2. 기능 요구사항

### 2.1 기본 차트 (Must Have)
- [ ] 캔들스틱 차트
- [ ] 타임프레임 변경 (1분~월봉)
- [ ] 기본 지표 (MA, RSI, MACD, 볼린저밴드)
- [ ] 드로잉 도구 (추세선, 피보나치)
- [ ] 심볼 검색/변경

### 2.2 Trading System (Must Have)
- [ ] 트리거 설정 (가격, 지표 조건)
- [ ] 트리거 목록 확인
- [ ] 트리거 알림
- [ ] 차트에 트리거 표시

### 2.3 AI 연동 (Must Have)
- [ ] 차트 분석 질문
- [ ] AI 응답 기반 트리거 설정

### 2.4 선택 기능 (Nice to Have)
- [ ] 멀티 차트 레이아웃
- [ ] 커스텀 지표
- [ ] 차트 템플릿 저장
- [ ] 백테스팅

### 2.5 제외 범위 (Out of Scope)
- 실시간 주문 실행
- 호가창

---

## 3. 화면 설계

### 3.1 화면 목록

| 화면명 | 경로 | 설명 |
|--------|------|------|
| 차트 분석 | `/chart` | 기본 차트 화면 |
| 종목 차트 | `/chart/[symbol]` | 특정 종목 차트 |

### 3.2 화면 구성

```
┌────────────────────────────────────────────────────────────────┐
│ [검색] BTC/USDT ▼     [1H] [4H] [1D] [1W]     [지표] [도구]   │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│                                                                │
│                    ┌───────────────────┐                       │
│                    │                   │                       │
│              ╱╲    │    캔들스틱       │                       │
│             ╱  ╲   │       차트        │   ▲ 트리거           │
│            ╱    ╲──│                   │   라인 표시          │
│    ───────╱      ╲─│                   │                       │
│                    │                   │                       │
│                    └───────────────────┘                       │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│ [RSI]  ───────────────────────────                             │
│        30 ─────────────────────────                            │
├────────────────────────────────────────────────────────────────┤
│ Trading System                                    [+ 트리거]   │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ 🔔 BTC $45,000 도달 시 알림          [ON]    [편집] [삭제] │ │
│ │ 🔔 RSI 30 이하 진입 시 알림          [ON]    [편집] [삭제] │ │
│ └────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

#### 트리거 설정 모달
```
┌─────────────────────────────────────┐
│ 트리거 설정                    [X]  │
├─────────────────────────────────────┤
│                                     │
│ 조건 타입                           │
│ [가격] [지표]                       │
│                                     │
│ 조건                                │
│ ┌───────────┐ ┌──────┐ ┌─────────┐  │
│ │ 가격      │ │ >=   │ │ 45000   │  │
│ └───────────┘ └──────┘ └─────────┘  │
│                                     │
│ 알림 방식                           │
│ [✓] 푸시 알림                       │
│ [✓] 앱 내 알림                      │
│                                     │
│ [취소]                     [저장]   │
└─────────────────────────────────────┘
```

### 3.3 상태별 화면
- **기본 상태**: 차트 표시
- **로딩 상태**: 차트 스켈레톤
- **빈 상태**: 심볼 검색 유도
- **에러 상태**: 데이터 로드 실패 메시지

---

## 4. 데이터 모델

### 4.1 주요 엔티티

```typescript
// 캔들 데이터
interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// 차트 설정
interface ChartConfig {
  symbol: string;
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w' | '1M';
  indicators: Indicator[];
  drawings: Drawing[];
}

// 지표
interface Indicator {
  type: 'ma' | 'rsi' | 'macd' | 'bollinger';
  params: Record<string, number>;
  visible: boolean;
}

// 트리거
interface Trigger {
  id: string;
  userId: string;
  symbol: string;
  conditionType: 'price' | 'indicator';
  condition: {
    field: string;
    operator: 'gte' | 'lte' | 'eq';
    value: number;
  };
  isActive: boolean;
  notificationTypes: ('push' | 'in_app')[];
  createdAt: string;
}
```

### 4.2 API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/chart/candles` | 캔들 데이터 |
| GET | `/chart/symbols` | 심볼 검색 |
| GET | `/triggers` | 트리거 목록 |
| POST | `/triggers` | 트리거 생성 |
| PUT | `/triggers/:id` | 트리거 수정 |
| DELETE | `/triggers/:id` | 트리거 삭제 |
| PATCH | `/triggers/:id/toggle` | 트리거 활성화/비활성화 |

---

## 5. 비즈니스 로직

### 5.1 주요 로직
1. **캔들 데이터 로딩**: 타임프레임별 히스토리 + 실시간 업데이트
2. **지표 계산**: 클라이언트 또는 서버 계산
3. **트리거 체크**: 서버에서 실시간 조건 체크 → 알림 발송
4. **차트 드로잉 저장**: 로컬 저장 또는 서버 저장

### 5.2 유효성 검사
- **트리거 조건**: 유효한 가격/지표 값
- **심볼**: 지원 심볼 목록 내 존재

### 5.3 예외 처리
| 에러 코드 | 상황 | 대응 |
|----------|------|------|
| 404 | 심볼 없음 | 심볼 검색 유도 |
| 429 | API 제한 | 캐시 데이터 표시 |

---

## 6. 컴포넌트 설계

### 6.1 컴포넌트 구조

```
components/features/chart/
├── ChartViewer.tsx
├── ChartToolbar.tsx
├── TimeframeSelector.tsx
├── SymbolSearch.tsx
├── IndicatorPanel.tsx
├── DrawingTools.tsx
├── TradingSystem/
│   ├── TriggerList.tsx
│   ├── TriggerForm.tsx
│   └── TriggerItem.tsx
└── hooks/
    ├── useChartData.ts
    ├── useTriggers.ts
    └── useIndicators.ts
```

### 6.2 Props 정의

```typescript
interface ChartViewerProps {
  symbol: string;
  timeframe: Timeframe;
  indicators?: Indicator[];
  triggers?: Trigger[];
  onSymbolChange?: (symbol: string) => void;
}
```

---

## 7. 상태 관리

### 7.1 로컬 상태
- 차트 설정 (타임프레임, 지표)
- 드로잉 데이터

### 7.2 전역 상태 (Zustand)
```typescript
interface ChartStore {
  currentSymbol: string;
  setSymbol: (symbol: string) => void;
}
```

### 7.3 서버 상태 (TanStack Query)
- 캔들 데이터 쿼리
- 트리거 CRUD

---

## 8. 의존성

### 8.1 내부 의존성
- `lib/api/chart.ts`
- `components/layout/TradexAI`

### 8.2 외부 의존성
- `lightweight-charts`: TradingView 차트
- `technicalindicators`: 지표 계산

---

## 9. 테스트 계획

### 9.1 단위 테스트
- [ ] 지표 계산
- [ ] 트리거 조건 평가

### 9.2 통합 테스트
- [ ] 차트 데이터 로딩
- [ ] 트리거 CRUD

### 9.3 E2E 테스트
- [ ] 트리거 설정 → 조건 충족 → 알림

---

## 10. 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|----------|--------|
| 0.1 | 2024-12-22 | 초안 작성 | - |

---

## 11. 미결 사항 / 질문

- [ ] 지원 거래소/심볼 범위
- [ ] 실시간 데이터 제공 방식 (WebSocket?)
- [ ] 차트 라이브러리 최종 선정

---

## 12. 참고 자료

- [User Flow - 차트분석](../../USER_FLOW.md#35-차트분석)
- [Architecture](../../ARCHITECTURE.md)
