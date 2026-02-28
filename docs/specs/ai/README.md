# Tradex AI 스펙 문서

> **상태**: `✅ 완료`
> **최종 수정**: 2026-03-01
> **구현 완료일**: 2026-02-19

---

## 1. 개요

AI 채팅 기반 매매 분석 서비스입니다. 채팅 세션 관리, SSE 스트리밍 응답, 음성 입력, 사이드 패널 전역 접근을 지원합니다.

---

## 2. 구현된 기능

### 2.1 AI 채팅 페이지 (`/ai`, `/ai/chat`)
- ✅ 채팅 세션 목록 조회 및 신규 생성 (`chatSessionApi`)
- ✅ SSE 스트리밍 응답 (`aiApi.streamChat()`)
- ✅ 메시지 목록 표시 (사용자/AI 구분)
- ✅ 빈 상태: AI 액션 메뉴 (SVG 아이콘 버튼 그리드)
- ✅ 세션별 대화 이력 유지
- ✅ Tradex 아이콘 로고 (`public/images/tradex-icon.svg`)

### 2.2 사이드 패널 (`TradexAIPanel`)
- ✅ 헤더 버튼으로 전역 접근 (어느 페이지에서나 사용 가능)
- ✅ Dynamic import (`next/dynamic`)으로 지연 로딩
- ✅ SSE 스트리밍 채팅
- ✅ 음성 입력: Web Speech API (`ko-KR`, Chrome/Edge 지원)
  - 마이크 버튼 클릭 → 음성 인식 시작
  - 녹음 중: 빨간색 + `animate-pulse` 애니메이션
  - 인식 결과 → 입력창 자동 채움
  - 재클릭 → 녹음 중지

---

## 3. 화면 목록

| 화면명 | 경로 | 파일 |
|--------|------|------|
| AI 메인 | `/ai` | `src/app/(main)/ai/page.tsx` |
| AI 채팅 | `/ai/chat` | `src/app/(main)/ai/chat/page.tsx` |
| AI 사이드 패널 | (전역) | `src/components/layout/TradexAIPanel.tsx` |

---

## 4. API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/ai/chat/sessions` | 채팅 세션 목록 |
| POST | `/api/ai/chat/sessions` | 세션 생성 |
| GET | `/api/ai/chat/sessions/{id}` | 세션 상세 (메시지 이력) |
| DELETE | `/api/ai/chat/sessions/{id}` | 세션 삭제 |
| POST | `/api/ai/chat/sessions/{id}/messages` | 메시지 전송 (SSE 스트리밍) |

---

## 5. 핵심 구현 파일

| 파일 | 역할 |
|------|------|
| `src/lib/api/ai.ts` | `aiApi.streamChat()`, `chatSessionApi` |
| `src/components/layout/TradexAIPanel.tsx` | 사이드 패널 (음성 입력 포함) |
| `src/types/speech.d.ts` | Web Speech API 타입 선언 |

---

## 6. 주요 의사결정

| 항목 | 결정 |
|------|------|
| AI 모델 | 백엔드 결정 (프론트는 SSE 스트리밍 API만 사용) |
| 음성 입력 | Web Speech API (무료, 한국어/영어 혼용 지원, Chrome/Edge) |
| 스트리밍 방식 | SSE (Server-Sent Events) |

---

## 7. 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0 | 2026-03-01 | 실제 구현 기준으로 전면 재작성, 음성 입력 반영 |
| 0.1 | 2024-12-22 | 초안 작성 |
