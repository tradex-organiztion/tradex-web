# 매매 관리 (Trading) 스펙 문서

> **상태**: `✅ 완료`
> **최종 수정**: 2026-03-01
> **구현 완료일**: 2026-02-19

---

## 1. 개요

매매 원칙 관리와 매매일지 작성/조회를 제공합니다. 거래소 포지션/주문 데이터 자동 연동, 캘린더/리스트 뷰, AI 분석 연동 기능이 구현되어 있습니다.

---

## 2. 구현된 기능

### 2.1 매매 원칙
- ✅ 원칙 목록 조회 (`GET /api/trading/principles`)
- ✅ 원칙 등록/수정/삭제 (CRUD)
- ✅ AI 원칙 추천 배지 표시
- ✅ TradingPrinciples 사이드 패널 (`PrinciplesSidePanel`)
- ✅ 원칙 없는 경우 빈 상태 UI

### 2.2 매매일지
- ✅ 일지 목록: 캘린더 뷰 / 리스트 뷰 토글
- ✅ 일지 작성 (`/trading/journal/new`)
  - 거래소 포지션 자동 연동 (`positionsApi`)
  - 거래소 주문 자동 연동 (`ordersApi`)
  - 수동 입력 지원
  - 사전 시나리오 / 매매 후 복기 모드
  - 오더 추가 기능
- ✅ 일지 상세/수정 (`/trading/journal/[id]`)
- ✅ 필터링: 기간, 포지션, 수익/손실
- ✅ 캘린더: 날짜별 매매 카드 (Closed P&L USDT 표시)
- ✅ 차트 스크린샷 첨부 (`journalApi.uploadScreenshot()`)

---

## 3. 화면 목록

| 화면명 | 경로 | 파일 |
|--------|------|------|
| 매매 원칙 목록 | `/trading/principles` | `src/app/(main)/trading/principles/page.tsx` |
| 매매일지 목록 | `/trading/journal` | `src/app/(main)/trading/journal/page.tsx` |
| 일지 작성 | `/trading/journal/new` | `src/app/(main)/trading/journal/new/page.tsx` |
| 일지 상세/수정 | `/trading/journal/[id]` | `src/app/(main)/trading/journal/[id]/page.tsx` |

---

## 4. API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/trading/principles` | 원칙 목록 |
| POST | `/api/trading/principles` | 원칙 등록 |
| PUT | `/api/trading/principles/{id}` | 원칙 수정 |
| DELETE | `/api/trading/principles/{id}` | 원칙 삭제 |
| GET | `/api/trading/journals` | 일지 목록 (필터) |
| POST | `/api/trading/journals` | 일지 등록 |
| GET | `/api/trading/journals/{id}` | 일지 상세 |
| PUT | `/api/trading/journals/{id}` | 일지 수정 |
| DELETE | `/api/trading/journals/{id}` | 일지 삭제 |
| POST | `/api/trading/journals/{id}/screenshot` | 스크린샷 업로드 |
| GET | `/api/trading/journals/stats` | 일지 통계 |
| GET | `/api/futures/positions` | 포지션 목록 |
| GET | `/api/futures/orders` | 주문 목록 |

---

## 5. 핵심 구현 파일

| 파일 | 역할 |
|------|------|
| `src/lib/api/trading.ts` | `journalApi`, `journalStatsApi` |
| `src/lib/api/tradingPrinciple.ts` | `tradingPrincipleApi` |
| `src/lib/api/futures.ts` | `positionsApi`, `ordersApi` |
| `src/components/trading/JournalForm.tsx` | 일지 작성/수정 폼 |
| `src/components/trading/JournalList.tsx` | 일지 리스트 뷰 |
| `src/components/trading/JournalCalendar.tsx` | 일지 캘린더 뷰 |
| `src/components/trading/PrinciplesSidePanel.tsx` | 원칙 사이드 패널 |

---

## 6. 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0 | 2026-03-01 | 실제 구현 기준으로 전면 재작성 |
| 0.1 | 2024-12-22 | 초안 작성 |
