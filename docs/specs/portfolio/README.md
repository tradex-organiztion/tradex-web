# 수익 관리 (Portfolio) 스펙 문서

> **상태**: `✅ 완료`
> **최종 수정**: 2026-03-01
> **구현 완료일**: 2026-02-19

---

## 1. 개요

자산 현황과 손익(P&L) 데이터를 관리합니다. 자산 분포 차트, 누적 수익 차트, 일별 손익 캘린더, 종목별 손익 분석이 구현되어 있습니다.

---

## 2. 구현된 기능

### 2.1 자산 현황 (`/portfolio/assets`)
- ✅ 총 자산 요약 (현재가, 변화율)
- ✅ 자산별 비중 차트 (도넛 차트)
- ✅ 자산 히스토리 (기간별 변화 그래프)
- ✅ 자산 상세 테이블
- ✅ `portfolioApi` 연동 (summary, assetDistribution, assetHistory)

### 2.2 손익 관리 (`/portfolio/pnl`)
- ✅ 실현/미실현 손익 요약 카드
- ✅ 누적 수익 차트 (`PnLChart`)
- ✅ 일별 손익 캘린더 (`DailyProfitCalendar`)
- ✅ 종목별 손익 분석
- ✅ `futuresApi` 연동 (dailyProfit, cumulativeProfit)

---

## 3. 화면 목록

| 화면명 | 경로 | 파일 |
|--------|------|------|
| 자산 현황 | `/portfolio/assets` | `src/app/(main)/portfolio/assets/page.tsx` |
| 손익 관리 | `/portfolio/pnl` | `src/app/(main)/portfolio/pnl/page.tsx` |

---

## 4. API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/portfolio/summary` | 자산 요약 |
| GET | `/api/portfolio/asset-distribution` | 자산 분포 |
| GET | `/api/portfolio/daily-profit` | 일별 수익 |
| GET | `/api/portfolio/cumulative-profit` | 누적 수익 |
| GET | `/api/portfolio/asset-history` | 자산 히스토리 |
| GET | `/api/futures/daily-profit` | 선물 일별 손익 |
| GET | `/api/futures/cumulative-profit` | 선물 누적 손익 |

---

## 5. 핵심 구현 파일

| 파일 | 역할 |
|------|------|
| `src/lib/api/portfolio.ts` | `portfolioApi` (summary, distribution, history) |
| `src/lib/api/futures.ts` | `futuresApi` (dailyProfit, cumulativeProfit) |
| `src/app/(main)/portfolio/assets/page.tsx` | 자산 현황 페이지 |
| `src/app/(main)/portfolio/pnl/page.tsx` | 손익 관리 페이지 |

---

## 6. 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0 | 2026-03-01 | 실제 구현 기준으로 전면 재작성 |
| 0.1 | 2024-12-22 | 초안 작성 |
