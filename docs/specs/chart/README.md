# 차트 분석 (Chart) 스펙 문서

> **상태**: `✅ 완료`
> **최종 수정**: 2026-03-01
> **구현 완료일**: 2026-02-19

---

## 1. 개요

TradingView Charting Library v30 기반의 차트 분석 페이지입니다. Binance WebSocket 직접 연동으로 실시간 데이터를 제공하며, 멀티 거래소 지원, 테마 토글, 차트 레이아웃 저장/불러오기 기능이 구현되어 있습니다.

---

## 2. 구현된 기능

- ✅ TradingView Charting Library v30 (`TVChartContainer`)
- ✅ Binance 직접 WebSocket 실시간 데이터 (`chart.ts` 커스텀 datafeed)
- ✅ 멀티 거래소 지원: Binance, Bybit, Bitget (`ExchangeFilter` 드롭다운)
- ✅ 라이트/다크 테마 토글
- ✅ 차트 레이아웃 저장/불러오기 (`chartLayoutApi`, save/load adapter)
- ✅ TriggerPanel (트리거 설정 UI)
- ✅ 심볼 검색/변경 (TradingView 내장)
- ✅ 타임프레임 변경 (1분~월봉)
- ✅ 기술적 지표 (TradingView 내장: MA, RSI, MACD, 볼린저밴드 등)
- ✅ 드로잉 도구 (TradingView 내장)

---

## 3. 화면 목록

| 화면명 | 경로 | 파일 |
|--------|------|------|
| 차트 분석 | `/chart` | `src/app/(main)/chart/page.tsx` |

---

## 4. API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| (Binance 직접) | Binance REST/WS | 심볼 정보, 캔들 데이터, 실시간 업데이트 |
| GET | `/api/chart/layouts` | 저장된 레이아웃 목록 |
| POST | `/api/chart/layouts` | 레이아웃 저장 |
| PUT | `/api/chart/layouts/{id}` | 레이아웃 수정 |
| DELETE | `/api/chart/layouts/{id}` | 레이아웃 삭제 |

---

## 5. 핵심 구현 파일

| 파일 | 역할 |
|------|------|
| `src/components/chart/TVChartContainer.tsx` | TradingView 차트 컨테이너 |
| `src/lib/chart/datafeed.ts` | Binance 직접 연동 datafeed |
| `src/lib/chart/saveLoadAdapter.ts` | 차트 레이아웃 저장/불러오기 |
| `src/lib/api/chart.ts` | symbolInfo, getBars (Binance) |
| `src/lib/api/chartLayout.ts` | 레이아웃 CRUD API |

---

## 6. 주요 의사결정

| 항목 | 결정 |
|------|------|
| 차트 라이브러리 | TradingView Charting Library v30 (상용 라이선스) |
| 실시간 데이터 | Binance 직접 WebSocket (백엔드 미경유) |
| 지원 거래소 | Binance, Bybit, Bitget |
| 레이아웃 저장 | 백엔드 `chartLayoutApi` 연동 |

---

## 7. 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0 | 2026-03-01 | 실제 구현 기준으로 전면 재작성 |
| 0.1 | 2024-12-22 | 초안 작성 |
