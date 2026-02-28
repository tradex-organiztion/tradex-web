# 분석 (Analysis) 스펙 문서

> **상태**: `✅ 완료`
> **최종 수정**: 2026-03-01
> **구현 완료일**: 2026-02-19

---

## 1. 개요

전략 분석과 리스크 매핑 두 페이지로 구성됩니다. 전략 분석은 매매일지 데이터 기반 변수별 성과를 보여주고, 리스크 매핑은 5개 카테고리(진입/청산/포지션/시간상황/감정) 리스크를 시각화합니다.

---

## 2. 구현된 기능

### 2.1 전략 분석 (`/analysis/strategy`)
- ✅ 전략 변수별 성과 분석 (시간대, 요일, 포지션, 종목, 진입근거 등)
- ✅ 커스텀 전략 필터
- ✅ 분석 결과 카드/차트 표시
- ✅ `strategyApi` 연동
- ✅ `journalStatsApi` 연동
- ✅ Lighthouse 88점 (최적화 완료)

### 2.2 리스크 매핑 (`/analysis/risk`)
- ✅ 5개 리스크 카테고리 게이지/카드 표시
  - 진입 리스크
  - 청산 리스크
  - 포지션 관리 리스크
  - 시간상황 리스크
  - 감정 리스크
- ✅ `riskApi` 5개 엔드포인트 연동
- ✅ RiskGauge, RiskCard 컴포넌트

---

## 3. 화면 목록

| 화면명 | 경로 | 파일 |
|--------|------|------|
| 전략 분석 | `/analysis/strategy` | `src/app/(main)/analysis/strategy/page.tsx` |
| 리스크 매핑 | `/analysis/risk` | `src/app/(main)/analysis/risk/page.tsx` |

> `데이터 보기` 페이지(`/analysis/data`)는 미구현 (기획 범위 외로 확정)

---

## 4. API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/analysis/strategy` | 전략 분석 데이터 |
| GET | `/api/trading/journals/stats` | 매매일지 통계 |
| GET | `/api/analysis/risk/entry` | 진입 리스크 |
| GET | `/api/analysis/risk/exit` | 청산 리스크 |
| GET | `/api/analysis/risk/position` | 포지션 관리 리스크 |
| GET | `/api/analysis/risk/time` | 시간상황 리스크 |
| GET | `/api/analysis/risk/emotion` | 감정 리스크 |

---

## 5. 핵심 구현 파일

| 파일 | 역할 |
|------|------|
| `src/lib/api/analysis.ts` | `riskApi` (5개 카테고리), `strategyApi` |
| `src/app/(main)/analysis/strategy/page.tsx` | 전략 분석 페이지 |
| `src/app/(main)/analysis/risk/page.tsx` | 리스크 매핑 페이지 |

---

## 6. 주요 의사결정

| 항목 | 결정 |
|------|------|
| 리스크 계산 공식 | 백엔드 API 기반 (프론트는 표시만) |
| 리스크 카테고리 | 5개: 진입/청산/포지션/시간상황/감정 |
| 데이터 보기 페이지 | 미구현 (범위 외) |
| 인사이트 | AI 생성 아님, 백엔드 분석 결과 표시 |

---

## 7. 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0 | 2026-03-01 | 실제 구현 기준으로 전면 재작성 |
| 0.1 | 2024-12-22 | 초안 작성 |
