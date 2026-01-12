# Tradex 기획/스펙 문서 인덱스

## 개요

이 디렉토리는 Tradex 서비스의 기능별 기획 및 스펙 문서를 포함합니다.

## 문서 작성 가이드

### 새 스펙 문서 작성 시
1. `_TEMPLATE.md`를 복사하여 시작
2. 모든 섹션을 채우거나 해당 없음 표시
3. 미결 사항은 반드시 기록
4. 변경 시 변경 이력 업데이트

### 상태 정의
- `미작성`: 문서 미생성
- `작성중`: 초안 작성 중
- `검토중`: 리뷰 대기
- `확정`: 최종 확정

---

## 스펙 문서 목록

### 인증 (Auth)
- **경로**: [auth/README.md](./auth/README.md)
- **상태**: 작성중
- **범위**: 로그인, 회원가입, 온보딩

### 홈 (Home)
- **경로**: [home/README.md](./home/README.md)
- **상태**: 작성중
- **범위**: 대시보드, 요약 정보

### Tradex AI
- **경로**: [ai/README.md](./ai/README.md)
- **상태**: 작성중
- **범위**: AI 채팅, 파일 업로드, 음성 입력

### 수신함 (Inbox)
- **경로**: [inbox/README.md](./inbox/README.md)
- **상태**: 작성중
- **범위**: 알림 목록, 알림 관리

### 매매 관리 (Trading)
- **경로**: [trading/README.md](./trading/README.md)
- **상태**: 작성중
- **범위**: 매매 원칙, 매매일지

### 차트 분석 (Chart)
- **경로**: [chart/README.md](./chart/README.md)
- **상태**: 작성중
- **범위**: 차트 뷰어, 트리거 시스템

### 분석 (Analysis)
- **경로**: [analysis/README.md](./analysis/README.md)
- **상태**: 작성중
- **범위**: 전략 분석, 리스크 매핑

### 수익 관리 (Portfolio)
- **경로**: [portfolio/README.md](./portfolio/README.md)
- **상태**: 작성중
- **범위**: 자산 현황, 손익 관리

### 설정 (Settings)
- **경로**: [settings/README.md](./settings/README.md)
- **상태**: 작성중
- **범위**: 계정, 환경설정, 알림, 구독

---

## 디렉토리 구조

```
docs/specs/
├── README.md           # 이 파일 (인덱스)
├── _TEMPLATE.md        # 스펙 문서 템플릿
├── auth/
│   └── README.md       # 인증 스펙
├── home/
│   └── README.md       # 홈 스펙
├── ai/
│   └── README.md       # AI 스펙
├── inbox/
│   └── README.md       # 수신함 스펙
├── trading/
│   └── README.md       # 매매 관리 스펙
├── chart/
│   └── README.md       # 차트 분석 스펙
├── analysis/
│   └── README.md       # 분석 스펙
├── portfolio/
│   └── README.md       # 수익 관리 스펙
└── settings/
    └── README.md       # 설정 스펙
```

---

## 관련 문서

- [User Flow](../USER_FLOW.md) - 전체 유저 플로우
- [Architecture](../ARCHITECTURE.md) - 아키텍처 설계
- [Status](../STATUS.md) - 프로젝트 현황
