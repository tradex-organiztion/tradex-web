# 수신함 (Inbox) 기획/스펙 문서

> **상태**: `작성중`
> **최종 수정**: 2024-12-22
> **담당자**: -

---

## 1. 개요

### 1.1 목적
트리거 알림, 매매 원칙 알림 등 모든 알림을 통합 관리하는 기능을 제공합니다.

### 1.2 사용자 스토리
- As a 트레이더, I want to 모든 알림을 한곳에서 확인, so that 중요한 알림을 놓치지 않을 수 있다.
- As a 트레이더, I want to 차트 관련 알림에서 바로 차트로 이동, so that 빠르게 대응할 수 있다.
- As a 트레이더, I want to 알림을 읽음 처리, so that 확인한 알림을 구분할 수 있다.

---

## 2. 기능 요구사항

### 2.1 필수 기능 (Must Have)
- [ ] 알림 목록 조회
- [ ] 알림 읽음/안읽음 처리
- [ ] 알림 타입별 필터링
- [ ] 차트 바로가기 (차트 관련 알림)
- [ ] 알림 삭제
- [ ] 전체 읽음 처리

### 2.2 선택 기능 (Nice to Have)
- [ ] 알림 검색
- [ ] 알림 보관함
- [ ] 알림 일괄 삭제

### 2.3 제외 범위 (Out of Scope)
- 알림 예약 발송
- 알림 공유

---

## 3. 화면 설계

### 3.1 화면 목록

| 화면명 | 경로 | 설명 |
|--------|------|------|
| 알림 목록 | `/inbox` | 전체 알림 목록 |
| 알림 상세 | `/inbox/[id]` | 알림 상세 (선택) |

### 3.2 화면 구성

```
┌─────────────────────────────────────────┐
│ 수신함                    [전체 읽음]   │
├─────────────────────────────────────────┤
│ [전체] [트리거] [매매원칙] [시스템]     │
├─────────────────────────────────────────┤
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 🔔 트리거 발동                      │ │
│ │ AAPL 매수 신호가 발생했습니다       │ │
│ │ 2분 전  [차트 바로가기]       [···] │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 📋 매매 원칙 알림                  │ │
│ │ "손절 5% 규칙" 위반 가능성          │ │
│ │ 1시간 전                      [···] │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ ⚙️ 시스템 알림           (읽음)    │ │
│ │ 구독이 갱신되었습니다               │ │
│ │ 어제                          [···] │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### 3.3 상태별 화면
- **기본 상태**: 알림 목록 표시
- **로딩 상태**: 스켈레톤 UI
- **빈 상태**: "새로운 알림이 없습니다" + 일러스트
- **에러 상태**: 재시도 버튼

---

## 4. 데이터 모델

### 4.1 주요 엔티티

```typescript
interface Notification {
  id: string;
  type: 'trigger' | 'principle' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  link?: {
    type: 'chart' | 'journal' | 'settings';
    path: string;
    params?: Record<string, string>;
  };
  metadata?: {
    symbol?: string;
    triggerType?: string;
    principleId?: string;
  };
  createdAt: string;
}

interface NotificationFilter {
  type?: 'trigger' | 'principle' | 'system';
  isRead?: boolean;
}
```

### 4.2 API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/notifications` | 알림 목록 (페이지네이션) |
| GET | `/notifications/:id` | 알림 상세 |
| PATCH | `/notifications/:id/read` | 읽음 처리 |
| PATCH | `/notifications/read-all` | 전체 읽음 처리 |
| DELETE | `/notifications/:id` | 알림 삭제 |

---

## 5. 비즈니스 로직

### 5.1 주요 로직
1. **읽음 처리**: 알림 클릭 시 자동 읽음 처리
2. **링크 이동**: 차트 알림 → 해당 차트 페이지로 이동
3. **뱃지 카운트**: 안읽은 알림 수 실시간 반영

### 5.2 유효성 검사
- N/A

### 5.3 예외 처리
| 에러 코드 | 상황 | 대응 |
|----------|------|------|
| 404 | 알림 없음 | 목록에서 제거 |
| 500 | 서버 에러 | 재시도 |

---

## 6. 컴포넌트 설계

### 6.1 컴포넌트 구조

```
components/features/inbox/
├── NotificationList.tsx
├── NotificationItem.tsx
├── NotificationFilter.tsx
├── NotificationActions.tsx
└── hooks/
    └── useNotifications.ts
```

### 6.2 Props 정의

```typescript
interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
  onNavigate: (link: NotificationLink) => void;
}
```

---

## 7. 상태 관리

### 7.1 로컬 상태
- 현재 필터 타입
- 선택된 알림 ID (삭제용)

### 7.2 전역 상태 (Zustand)
```typescript
interface NotificationStore {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  decrementUnread: () => void;
}
```

### 7.3 서버 상태 (TanStack Query)
- 알림 목록 쿼리 (무한 스크롤)
- 읽음 처리 뮤테이션

---

## 8. 의존성

### 8.1 내부 의존성
- `lib/api/notifications.ts`
- `stores/useNotificationStore.ts`

### 8.2 외부 의존성
- `date-fns`: 시간 포맷팅

---

## 9. 테스트 계획

### 9.1 단위 테스트
- [ ] 시간 포맷팅 (방금, N분 전, N시간 전)
- [ ] 필터 로직

### 9.2 통합 테스트
- [ ] 알림 목록 로딩
- [ ] 읽음 처리

### 9.3 E2E 테스트
- [ ] 알림 클릭 → 차트 이동
- [ ] 전체 읽음 처리

---

## 10. 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|----------|--------|
| 0.1 | 2024-12-22 | 초안 작성 | - |

---

## 11. 미결 사항 / 질문

- [ ] 알림 보관 기간 정책 (30일? 90일?)
- [ ] 푸시 알림 연동 범위

---

## 12. 참고 자료

- [User Flow - 수신함](../../USER_FLOW.md#33-수신함-inbox)
- [Architecture](../../ARCHITECTURE.md)
