# Tradex AI 기획/스펙 문서

> **상태**: `작성중`
> **최종 수정**: 2024-12-22
> **담당자**: -

---

## 1. 개요

### 1.1 목적
AI 채팅 기반 트레이딩 분석 도구를 제공하여 사용자의 의사결정을 지원합니다.

### 1.2 사용자 스토리
- As a 트레이더, I want to AI에게 차트 분석 질문, so that 전문적인 인사이트를 얻을 수 있다.
- As a 트레이더, I want to 차트 이미지 업로드 분석, so that 현재 차트에 대한 의견을 받을 수 있다.
- As a 트레이더, I want to 음성으로 질문, so that 빠르게 AI와 소통할 수 있다.

---

## 2. 기능 요구사항

### 2.1 필수 기능 (Must Have)
- [ ] 채팅 기반 AI 대화
- [ ] 파일/이미지 업로드 분석
- [ ] 대화 히스토리 저장
- [ ] 사이드 패널 UI
- [ ] 컨텍스트 인식 (현재 보고 있는 차트)

### 2.2 선택 기능 (Nice to Have)
- [ ] 음성 입력
- [ ] 음성 응답 (TTS)
- [ ] AI 응답 기반 트리거 설정
- [ ] 대화 북마크
- [ ] 대화 공유

### 2.3 제외 범위 (Out of Scope)
- 자동 매매 실행
- 실시간 시세 제공

---

## 3. 화면 설계

### 3.1 화면 목록

| 화면명 | 경로 | 설명 |
|--------|------|------|
| AI 사이드 패널 | (전역) | 사이드 패널 형태 |

### 3.2 화면 구성

```
┌─────────────────────────────┐
│ Tradex AI              [X]  │
├─────────────────────────────┤
│                             │
│  ┌────────────────────┐     │
│  │ AI: 안녕하세요!    │     │
│  │ 어떤 분석을 도와   │     │
│  │ 드릴까요?          │     │
│  └────────────────────┘     │
│                             │
│       ┌────────────────┐    │
│       │ User: BTC 차트 │    │
│       │ 분석해줘       │    │
│       └────────────────┘    │
│                             │
│  ┌────────────────────┐     │
│  │ AI: BTC 현재 ...   │     │
│  │ [차트 분석 결과]   │     │
│  │                    │     │
│  │ [트리거 설정하기]  │     │
│  └────────────────────┘     │
│                             │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ 메시지 입력...          │ │
│ └─────────────────────────┘ │
│ [📎] [🎤]          [전송]   │
└─────────────────────────────┘
```

### 3.3 상태별 화면
- **기본 상태**: 대화 목록 + 입력창
- **로딩 상태**: AI 응답 대기 (타이핑 인디케이터)
- **빈 상태**: 시작 가이드/추천 질문
- **에러 상태**: 재시도 버튼

---

## 4. 데이터 모델

### 4.1 주요 엔티티

```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  attachments?: Attachment[];
  context?: ChatContext;
  actions?: ChatAction[];
  createdAt: string;
}

interface Attachment {
  id: string;
  type: 'image' | 'file';
  url: string;
  name: string;
}

interface ChatContext {
  currentPage: string;
  symbol?: string;
  chartData?: object;
}

interface ChatAction {
  type: 'set_trigger' | 'view_chart' | 'add_principle';
  label: string;
  payload: object;
}

interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}
```

### 4.2 API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/ai/chat` | 메시지 전송 (스트리밍) |
| POST | `/ai/chat/upload` | 파일 업로드 |
| GET | `/ai/conversations` | 대화 목록 |
| GET | `/ai/conversations/:id` | 대화 상세 |
| DELETE | `/ai/conversations/:id` | 대화 삭제 |

---

## 5. 비즈니스 로직

### 5.1 주요 로직
1. **컨텍스트 주입**: 현재 페이지, 차트 정보를 AI 요청에 포함
2. **스트리밍 응답**: SSE로 실시간 응답 표시
3. **액션 버튼**: AI 응답에 실행 가능한 액션 포함

### 5.2 유효성 검사
- **메시지 길이**: 최대 4000자
- **파일 크기**: 최대 10MB
- **파일 형식**: PNG, JPG, PDF

### 5.3 예외 처리
| 에러 코드 | 상황 | 대응 |
|----------|------|------|
| 429 | Rate Limit | 대기 후 재시도 안내 |
| 413 | 파일 크기 초과 | 파일 압축 안내 |
| 500 | AI 서버 에러 | 재시도 버튼 |

---

## 6. 컴포넌트 설계

### 6.1 컴포넌트 구조

```
components/layout/TradexAI/
├── TradexAIPanel.tsx
├── ChatMessageList.tsx
├── ChatMessage.tsx
├── ChatInput.tsx
├── ChatActions.tsx
├── FileUploadButton.tsx
├── VoiceInputButton.tsx
└── hooks/
    ├── useChat.ts
    ├── useVoiceInput.ts
    └── useChatContext.ts
```

### 6.2 Props 정의

```typescript
interface TradexAIPanelProps {
  isOpen: boolean;
  onClose: () => void;
  context?: ChatContext;
}

interface ChatMessageProps {
  message: ChatMessage;
  onActionClick?: (action: ChatAction) => void;
}
```

---

## 7. 상태 관리

### 7.1 로컬 상태
- 입력 메시지
- 첨부 파일 목록
- 음성 녹음 상태

### 7.2 전역 상태 (Zustand)
```typescript
interface AIStore {
  isPanelOpen: boolean;
  currentConversationId: string | null;
  togglePanel: () => void;
  setConversation: (id: string) => void;
}
```

### 7.3 서버 상태 (TanStack Query)
- 대화 목록 쿼리
- 메시지 전송 뮤테이션

---

## 8. 의존성

### 8.1 내부 의존성
- `stores/useUIStore.ts`: 패널 상태
- `lib/api/ai.ts`: AI API

### 8.2 외부 의존성
- `eventsource-parser`: SSE 파싱
- `react-markdown`: 마크다운 렌더링
- Web Speech API: 음성 입력

---

## 9. 테스트 계획

### 9.1 단위 테스트
- [ ] 메시지 파싱
- [ ] 컨텍스트 생성

### 9.2 통합 테스트
- [ ] 채팅 전송/수신
- [ ] 파일 업로드

### 9.3 E2E 테스트
- [ ] 차트 분석 질문 → 트리거 설정
- [ ] 이미지 업로드 → 분석 결과

---

## 10. 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|----------|--------|
| 0.1 | 2024-12-22 | 초안 작성 | - |

---

## 11. 미결 사항 / 질문

- [ ] AI 모델 선정 (GPT-4, Claude 등)
- [ ] 음성 입력 필수 여부
- [ ] 대화 저장 기간 정책

---

## 12. 참고 자료

- [User Flow - Tradex AI](../../USER_FLOW.md#32-tradex-ai)
- [Architecture](../../ARCHITECTURE.md)
