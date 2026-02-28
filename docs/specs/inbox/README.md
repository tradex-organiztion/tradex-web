# 수신함 (Inbox) 스펙 문서

> **상태**: `✅ 완료`
> **최종 수정**: 2026-03-01
> **구현 완료일**: 2026-01-25

---

## 1. 개요

앱 내 알림을 통합 관리합니다. 전체/읽지않음 탭 필터, 읽음 처리, 삭제, 알림 상세 조회 기능이 구현되어 있습니다.

---

## 2. 구현된 기능

- ✅ 알림 목록 조회 (전체 / 읽지않음 탭)
- ✅ 알림 읽음 처리 (`PATCH /api/notifications/{id}/read`)
- ✅ 알림 삭제 (`DELETE /api/notifications/{id}`)
- ✅ 전체 읽음 처리 (`PATCH /api/notifications/read-all`)
- ✅ 알림 상세 페이지 (`/inbox/[id]`)
- ✅ 읽지않은 알림 수 뱃지 (헤더)
- ✅ InboxSidePanel 컴포넌트 (사이드 패널)
- ✅ 빈 상태 / 에러 상태 처리

---

## 3. 화면 목록

| 화면명 | 경로 | 파일 |
|--------|------|------|
| 수신함 목록 | `/inbox` | `src/app/(main)/inbox/page.tsx` |
| 알림 상세 | `/inbox/[id]` | `src/app/(main)/inbox/[id]/page.tsx` |
| 수신함 사이드 패널 | (컴포넌트) | `src/components/inbox/InboxSidePanel.tsx` |

---

## 4. API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/notifications` | 알림 목록 |
| GET | `/api/notifications/{id}` | 알림 상세 |
| PATCH | `/api/notifications/{id}/read` | 읽음 처리 |
| PATCH | `/api/notifications/read-all` | 전체 읽음 처리 |
| DELETE | `/api/notifications/{id}` | 알림 삭제 |

---

## 5. 핵심 구현 파일

| 파일 | 역할 |
|------|------|
| `src/lib/api/notification.ts` | 수신함 전용 API |
| `src/app/(main)/inbox/page.tsx` | 수신함 목록 페이지 |
| `src/components/inbox/InboxSidePanel.tsx` | 사이드 패널 |

---

## 6. 주요 의사결정

| 항목 | 결정 |
|------|------|
| 알림 채널 | 앱 내 알림만 (브라우저 푸시/이메일 미구현) |
| 알림 타입 필터 | 전체 / 읽지않음 탭 구현 (타입별 필터 미구현) |

---

## 7. 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0 | 2026-03-01 | 실제 구현 기준으로 전면 재작성 |
| 0.1 | 2024-12-22 | 초안 작성 |
