# 홈 대시보드 (Home) 스펙 문서

> **상태**: `✅ 완료`
> **최종 수정**: 2026-03-01
> **구현 완료일**: 2026-01-25

---

## 1. 개요

로그인 후 진입하는 대시보드 페이지입니다. 주간 수익, 총 자산, 매매 통계, 리스크 점수, Tradex AI 인사이트 카드를 표시합니다.

---

## 2. 구현된 기능

- ✅ 주간 수익 차트 (커스텀 SVG 라인 차트, 보라색 라인)
- ✅ 통계 카드: 총 자산, 수익률, 매매 횟수, 승률 (`StatCard`)
- ✅ 리스크 스코어 카드 (5개 카테고리 점수, `RiskScoreCard`)
- ✅ Tradex AI 인사이트 카드 (최근 AI 분석 요약, 녹색 그라디언트, `TradexAIInsightCard`)
- ✅ `homeApi.getSummary()` 연동 (`GET /api/home/summary`)
- ✅ 로딩/에러 상태 처리

---

## 3. 화면 목록

| 화면명 | 경로 | 파일 |
|--------|------|------|
| 홈 대시보드 | `/home` | `src/app/(main)/home/page.tsx` |

---

## 4. API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/home/summary` | 대시보드 통합 데이터 |

---

## 5. 핵심 컴포넌트

| 컴포넌트 | 파일 | 설명 |
|----------|------|------|
| `StatCard` | `src/components/home/StatCard.tsx` | 통계 카드 (수치 + 변화율 배지) |
| `WeeklyProfitChart` | `src/components/home/WeeklyProfitChart.tsx` | 주간 수익 라인 차트 (SVG, 보라색 `#7C3AED`) |
| `RiskScoreCard` | `src/components/home/RiskScoreCard.tsx` | 리스크 점수 시각화 |
| `TradexAIInsightCard` | `src/components/home/TradexAIInsightCard.tsx` | AI 인사이트 카드 (녹색 그라디언트) |

---

## 6. 구현 파일

| 파일 | 역할 |
|------|------|
| `src/lib/api/home.ts` | `homeApi.getSummary()` |
| `src/app/(main)/home/page.tsx` | 대시보드 페이지 |

---

## 7. 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0 | 2026-03-01 | 실제 구현 기준으로 전면 재작성 |
| 0.1 | 2024-12-22 | 초안 작성 |
