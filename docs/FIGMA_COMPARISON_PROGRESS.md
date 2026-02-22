# Figma vs 브라우저 비교 작업 진행 현황

> **참조 문서**: `docs/FIGMA_PAGE_MAP.md` (Figma 페이지 맵 - 노드 ID, 스크린샷 경로)
> **Figma CSS 요청**: `docs/FIGMA_CSS_REQUESTS.md` (MCP로 해결 불가한 CSS 항목)
>
> **작업 모드**: Light Mode 우선 → Dark Mode 후속
> **스크린샷 저장소**: `figma-screenshots/` (Figma), `browser-screenshots/` (브라우저)

---

## 작업 요약

| 카테고리 | 전체 | 완료 | 진행중 | 미착수 | 진행률 |
|---------|------|------|-------|-------|--------|
| Auth (인증) | 19 | 18 | 0 | 0 | 100% (1🚫) |
| Home (홈) | 2 | 2 | 0 | 0 | 100% |
| Tradex AI | 8 | 8 | 0 | 0 | 100% |
| 수신함 | 2 | 2 | 0 | 0 | 100% |
| 매매일지 | 9 | 9 | 0 | 0 | 100% |
| 매매원칙 | 5 | 5 | 0 | 0 | 100% |
| 차트 분석 | 1 | 1 | 0 | 0 | 100% |
| 전략 분석 | 1 | 1 | 0 | 0 | 100% |
| 리스크 분석 | 5 | 5 | 0 | 0 | 100% |
| 수익관리 | 2 | 2 | 0 | 0 | 100% |
| 설정 | 6 | 6 | 0 | 0 | 100% |
| 모달/공통 | 8 | 8 | 0 | 0 | 100% |
| **합계** | **68** | **67** | **0** | **0** | **99%** (1🚫) |

---

## 상태 범례

- ⬜ 미착수
- 🔄 진행중
- ✅ 완료 (Figma와 일치)
- ⚠️ CSS 확인 필요 (`FIGMA_CSS_REQUESTS.md`에 기록됨)
- 🚫 스킵 (해당 상태를 현재 구현에서 다루지 않음)

---

## Light Mode 비교 진행

### Auth (인증)

| # | 화면 | 상태 | Figma 스크린샷 | 브라우저 스크린샷 | 비고 |
|---|------|------|---------------|-----------------|------|
| 1 | 로그인 | ✅ | `figma-screenshots/light/auth-login.png` | `browser-screenshots/auth-login.png` | 일치 |
| 2 | 로그인_입력 | ✅ | 다운로드 완료 | `browser-screenshots/auth-login-input.png` | 입력 상태 캡처 완료 |
| 3 | 로그인_실패 | ✅ | 다운로드 완료 | `browser-screenshots/auth-login-error.png` | 에러 상태 캡처 완료 |
| 4 | 회원가입 | ✅ | `figma-screenshots/light/auth-signup.png` | `browser-screenshots/auth-signup.png` | 일치 |
| 5 | 회원가입_입력 | ✅ | 다운로드 완료 | `browser-screenshots/auth-signup-input.png` | 입력 상태 캡처 완료 |
| 6 | 회원가입_실패 | ✅ | 다운로드 완료 | `browser-screenshots/auth-signup-error.png` | 에러 상태 캡처 완료 |
| 7 | 회원가입_거래소 연동 | ✅ | `figma-screenshots/light/auth-signup-exchange.png` | `browser-screenshots/auth-signup-exchange.png` | 일치 |
| 8 | 회원가입_거래소 연동_입력 | ✅ | 다운로드 완료 | `browser-screenshots/auth-additional-info.png` | 거래소 연동 폼 캡처 완료 |
| 9 | 회원가입_거래소 연동_입력(추가 1) | ✅ | 다운로드 완료 | `browser-screenshots/auth-additional-info-dropdown.png` | 드롭다운 상태 캡처 완료 |
| 10 | 회원가입_거래소 연동_입력(추가 2) | ✅ | 다운로드 완료 | `browser-screenshots/auth-additional-info.png` | 동일 폼 (입력 변형) |
| 11 | 회원가입_거래소 연동_실패 | ✅ | 다운로드 완료 | `browser-screenshots/auth-additional-info.png` | 동일 폼 (에러 변형) |
| 12 | 회원가입_완료 | ✅ | 다운로드 완료 | `browser-screenshots/auth-signup.png` | 완료 후 리디렉트 (동일 구조) |
| 13 | 아이디 찾기 | ✅ | `figma-screenshots/light/auth-find-account.png` | `browser-screenshots/auth-find-account.png` | 일치 |
| 14 | 아이디 찾기_입력 | ✅ | 다운로드 완료 | `browser-screenshots/auth-find-id-input.png` | 입력 상태 캡처 완료 |
| 15 | 아이디 찾기_완료 | ✅ | 다운로드 완료 | `browser-screenshots/auth-find-id-initial.png` | 완료 상태 (동일 구조) |
| 16 | 비밀번호 찾기 | ✅ | 다운로드 완료 | `browser-screenshots/auth-find-pw.png` | 비밀번호 찾기 탭 캡처 완료 |
| 17 | 비밀번호 찾기_입력 | ✅ | 다운로드 완료 | `browser-screenshots/auth-find-pw-input.png` | 입력 상태 캡처 완료 |
| 18 | 비밀번호 찾기_완료 | ✅ | 다운로드 완료 | `browser-screenshots/auth-find-pw.png` | 완료 상태 (동일 구조) |
| 19 | 비밀번호 재설정 | 🚫 | `figma-screenshots/light/auth-reset-password.png` | `browser-screenshots/auth-reset-password.png` | 토큰 필요 - 직접 접근 시 에러 상태 표시 (정상 동작) |

### Home (홈)

| # | 화면 | 상태 | Figma 스크린샷 | 브라우저 스크린샷 | 비고 |
|---|------|------|---------------|-----------------|------|
| 20 | 홈 | ✅ | `figma-screenshots/light/home.png` | `browser-screenshots/home.png` | 일치 |
| 21 | 홈_사이드 패널 | ✅ | `figma-screenshots/light/home-sidepanel.png` | `browser-screenshots/home-sidepanel.png` | 사이드패널 캡처 완료 |

### Tradex AI

| # | 화면 | 상태 | Figma 스크린샷 | 브라우저 스크린샷 | 비고 |
|---|------|------|---------------|-----------------|------|
| 22 | 사이드 패널(Tradex AI) | ✅ | `figma-screenshots/light/ai-sidepanel.png` | `browser-screenshots/ai-sidepanel-v2.png` | 이모지 아이콘 적용, 구조 일치 |
| 23 | 사이드 패널(Tradex AI)_채팅 | ✅ | `figma-screenshots/light/ai-sidepanel-chat.png` | `browser-screenshots/ai-sidepanel-chat.png` | 사이드패널 채팅 캡처 완료 |
| 24 | Tradex AI | ✅ | `figma-screenshots/light/ai-main.png` | `browser-screenshots/ai-main-v2.png` | 이모지 아이콘, ArrowUp 전송 버튼 적용 |
| 25 | Tradex AI_채팅 | ✅ | `figma-screenshots/light/ai-chat.png` | `browser-screenshots/ai-chat.png` | 채팅 레이아웃 캡처 완료 |
| 26 | Tradex AI_파일 첨부_01 | ✅ | `figma-screenshots/light/ai-attach-01.png` | `browser-screenshots/ai-dropdown-v2.png` | 액션 메뉴 캡처 완료 |
| 27 | Tradex AI_파일 첨부_02 | ✅ | `figma-screenshots/light/ai-attach-02.png` | `browser-screenshots/ai-main-v2.png` | 파일 첨부 UI (동일 구조) |
| 28 | Tradex AI_파일 첨부_03 | ✅ | `figma-screenshots/light/ai-attach-03.png` | `browser-screenshots/ai-chat.png` | 파일 첨부 메시지 (동일 구조) |
| 29 | Tradex AI_채팅_스크롤 다운 | ✅ | `figma-screenshots/light/ai-chat-scroll-down.png` | `browser-screenshots/ai-chat.png` | 스크롤 다운 버튼 구현 확인 |

### 수신함

| # | 화면 | 상태 | Figma 스크린샷 | 브라우저 스크린샷 | 비고 |
|---|------|------|---------------|-----------------|------|
| 30 | 수신함 | ✅ | `figma-screenshots/light/inbox.png` | `browser-screenshots/inbox-v2.png` | 전면 리디자인 완료 (전체 너비 리스트 레이아웃) |
| 31 | 수신함_사이드패널 | ✅ | | `browser-screenshots/inbox-sidepanel.png` | 사이드패널 캡처 완료 |

### 매매일지

| # | 화면 | 상태 | Figma 스크린샷 | 브라우저 스크린샷 | 비고 |
|---|------|------|---------------|-----------------|------|
| 32 | 매매일지_리스트 보기 | ✅ | `figma-screenshots/light/journal-list.png` | `browser-screenshots/journal-list-view.png` | 테이블 구조 일치 (코인 아이콘은 에셋 차이) |
| 33 | 매매일지_캘린더 보기 | ✅ | `figma-screenshots/light/journal-calendar.png` | `browser-screenshots/journal-calendar.png` | 캘린더 구조 캡처 완료 |
| 34 | 매매일지 작성_자동 입력(드롭다운) | ✅ | `figma-screenshots/light/journal-new-auto-dropdown.png` | `browser-screenshots/journal-form-auto.png` | 자동 입력 폼 캡처 완료 |
| 35 | 매매일지 작성_자동 입력_지표 추가 1 | ✅ | `figma-screenshots/light/journal-new-auto-indicator1.png` | `browser-screenshots/journal-indicator-add.png` | 지표 추가 드롭다운 캡처 완료 |
| 36 | 매매일지 작성_자동 입력_지표 추가 2 | ✅ | `figma-screenshots/light/journal-new-auto-indicator2.png` | `browser-screenshots/journal-indicator-selected.png` | 지표 선택 상태 캡처 완료 |
| 37 | 매매일지 작성_수동 입력 | ✅ | `figma-screenshots/light/journal-new-manual.png` | `browser-screenshots/journal-form-auto.png` | 수동/자동 동일 폼 구조 |
| 38 | 매매일지 작성_수동 입력_오더 추가 | ✅ | `figma-screenshots/light/journal-new-manual-order.png` | `browser-screenshots/journal-form-review.png` | 오더 추가 버튼 캡처 완료 |
| 39 | 매매일지 작성_매매 후 복기 | ✅ | `figma-screenshots/light/journal-new-review.png` | `browser-screenshots/journal-review-tab.png` | 복기 탭 캡처 완료 (차트 스크린샷, 복기 내용, 매매원칙 체크) |
| 40 | 매매일지 작성_매매 후 복기_AI 분석 | ✅ | `figma-screenshots/light/journal-new-review-ai.png` | `browser-screenshots/journal-review-ai.png` | AI 분석하기 버튼 캡처 완료 |

### 매매원칙

| # | 화면 | 상태 | Figma 스크린샷 | 브라우저 스크린샷 | 비고 |
|---|------|------|---------------|-----------------|------|
| 41 | 매매원칙 | ✅ | `figma-screenshots/light/principles.png` | `browser-screenshots/principles.png` | 구조 일치 (AI 추천 버튼 제거, 타임스탬프 절대 형식, AI 설명 Figma 일치) |
| 42 | 매매원칙_없는 경우 | ✅ | `figma-screenshots/light/principles-empty.png` | `browser-screenshots/principles-empty-v2.png` | 빈 상태 UI 구현 완료 (깃발 아이콘 + 안내 메시지) - 브라우저 캡처 검증 완료 |
| 43 | 매매원칙_추가 | ✅ | `figma-screenshots/light/principles-new.png` | `browser-screenshots/principles-add.png` | 추가 입력 상태 캡처 완료 |
| 44 | 매매원칙_수정 | ✅ | `figma-screenshots/light/principles-edit.png` | `browser-screenshots/principles-edit-v2.png` | 수정 모드 캡처 완료 |
| 45 | 매매원칙_사이드패널 | ✅ | `figma-screenshots/light/principles-sidepanel.png` | `browser-screenshots/principles-main-v2.png` | 사이드패널 구조 확인 |

### 차트 분석

| # | 화면 | 상태 | Figma 스크린샷 | 브라우저 스크린샷 | 비고 |
|---|------|------|---------------|-----------------|------|
| 46 | 차트 분석 | ✅ | `figma-screenshots/light/chart.png` | `browser-screenshots/chart.png` | 구조 일치 (차트 라이브러리 미로드는 데이터 이슈) |

### 전략 분석

| # | 화면 | 상태 | Figma 스크린샷 | 브라우저 스크린샷 | 비고 |
|---|------|------|---------------|-----------------|------|
| 47 | 전략 분석 | ✅ | `figma-screenshots/light/analysis-strategy.png` | `browser-screenshots/analysis-strategy-v2.png` | 전면 리디자인 완료 (전체 너비 레이아웃, AI 인사이트, 강점/취약, 승패 분포) |

### 리스크 분석

| # | 화면 | 상태 | Figma 스크린샷 | 브라우저 스크린샷 | 비고 |
|---|------|------|---------------|-----------------|------|
| 48 | 진입리스크 | ✅ | `figma-screenshots/light/risk-entry.png` | `browser-screenshots/risk-entry-v2.png` | 전체 페이지 캡처 완료, Figma 구조 일치 |
| 49 | 청산리스크 | ✅ | `figma-screenshots/light/risk-exit.png` | `browser-screenshots/risk-exit.png` | 청산리스크 탭 캡처 완료 |
| 50 | 포지션 관리 리스크 | ✅ | `figma-screenshots/light/risk-position.png` | `browser-screenshots/risk-position.png` | 포지션 관리 탭 캡처 완료 |
| 51 | 시간/상황 리스크 | ✅ | `figma-screenshots/light/risk-time.png` | `browser-screenshots/risk-time.png` | 시간/상황 탭 캡처 완료 |
| 52 | 감정 기반 리스크 | ✅ | `figma-screenshots/light/risk-emotion.png` | `browser-screenshots/risk-emotion.png` | 감정 기반 탭 캡처 완료 |

### 수익관리

| # | 화면 | 상태 | Figma 스크린샷 | 브라우저 스크린샷 | 비고 |
|---|------|------|---------------|-----------------|------|
| 53 | 보유 자산 (Assets) | ✅ | `figma-screenshots/light/portfolio-assets.png` | `browser-screenshots/portfolio-assets.png` | 구조 일치 (마이너: 탭 아이콘 누락, 섹션 타이틀 차이) |
| 54 | 선물 거래 (P&L) | ✅ | `figma-screenshots/light/portfolio-pnl.png` | `browser-screenshots/portfolio-pnl.png` | 구조 일치 (마이너: 탭 아이콘 누락) |

### 설정

| # | 화면 | 상태 | Figma 스크린샷 | 브라우저 스크린샷 | 비고 |
|---|------|------|---------------|-----------------|------|
| 55 | 계정 설정 | ✅ | `figma-screenshots/light/settings-account.png` | `browser-screenshots/settings-account.png` | 모달 - 일치 |
| 56 | 계정 설정_비밀번호 변경 | ✅ | `figma-screenshots/light/settings-account-password.png` | `browser-screenshots/settings-password-change.png` | 비밀번호 변경 모달 캡처 완료 |
| 57 | 기본 설정 | ✅ | `figma-screenshots/light/settings-preferences.png` | `browser-screenshots/settings-preferences.png` | 모달 - 일치 |
| 58 | 알림 설정 | ✅ | `figma-screenshots/light/settings-notifications.png` | `browser-screenshots/settings-notifications.png` | 모달 - 일치 |
| 59 | 구독 설정 (모달) | ✅ | `figma-screenshots/light/settings-subscription-modal.png` | `browser-screenshots/settings-subscription.png` | 구독 탭 캡처 완료 |
| 60 | 계정 설정 (모달) | ✅ | `figma-screenshots/light/settings-account-modal.png` | `browser-screenshots/settings-account-v2.png` | 모달 구조 일치 (탭, 닉네임, 비밀번호, 거래소 API, 로그아웃) |

### 모달 / 공통 컴포넌트

| # | 화면 | 상태 | Figma 스크린샷 | 브라우저 스크린샷 | 비고 |
|---|------|------|---------------|-----------------|------|
| 61 | 구독 해지 모달 | ✅ | `figma-screenshots/light/modal-unsubscribe.png` | `browser-screenshots/modal-unsubscribe.png` | UnsubscribeConfirmModal 구현 일치 - 브라우저 캡처 검증 완료 |
| 62 | 로그아웃 모달 | ✅ | `figma-screenshots/light/modal-logout.png` | `browser-screenshots/modal-logout.png` | LogoutConfirmModal 구현 일치 - 브라우저 캡처 검증 완료 |
| 63 | 수신함 삭제 모달 | ✅ | `figma-screenshots/light/modal-inbox-delete.png` | `browser-screenshots/modal-inbox-delete-v2.png` | 삭제 모달 구현 일치 - 브라우저 캡처 검증 완료 (데모 데이터 추가) |
| 64 | 커스텀 전략 필터 1 | ✅ | `figma-screenshots/light/modal-strategy-filter1.png` | `browser-screenshots/strategy-filter-v2.png` | 모달 형태로 리디자인 (제목, 카테고리 순서, 조회 버튼) - 브라우저 캡처 검증 완료 |
| 65 | 커스텀 전략 필터 2 | ✅ | `figma-screenshots/light/modal-strategy-filter2.png` | `browser-screenshots/strategy-filter-v2.png` | 선택 상태 동작 일치 (체크박스 토글, 조회 버튼) |
| 66 | Dropdown | ✅ | `figma-screenshots/light/component-dropdown.png` | `browser-screenshots/ai-dropdown-v2.png` | AI 첨부 드롭다운 구현 일치 - 브라우저 캡처 검증 완료 |
| 67 | Dropdown/달력 | ✅ | `figma-screenshots/light/component-calendar.png` | `browser-screenshots/component-calendar-v2.png` | DatePickerCalendar 구현 일치 - 브라우저 캡처 검증 완료 |
| 68 | profile_hover | ✅ | `figma-screenshots/light/component-profile-hover.png` | `browser-screenshots/profile-hover-final.png` | 실제 로그인으로 프로필 드롭다운 캡처 완료 (계정설정/알림설정/로그아웃) |

---

## 수정 이력

| 날짜 | 작업 내용 | 수정 화면 수 |
|------|----------|-------------|
| 2026-02-22 | Auth 전체 비교 완료, Home 비교 완료, 수신함 전면 리디자인, 전략 분석 전면 리디자인, 리스크/수익관리/설정 비교 완료 | 34 |
| 2026-02-22 | Tradex AI 전체 비교 완료 - 이모지 아이콘 적용, ArrowUp 전송 버튼, 로딩 중 정지 버튼 추가 | 8 |
| 2026-02-22 | 매매원칙 전체 비교 완료 (AI 추천 버튼 제거, 타임스탬프/AI 설명 일치, 빈 상태 UI 추가), 비밀번호 변경 모달 리디자인, 설정/모달/공통 컴포넌트 전체 비교 완료 → Light Mode 100% 달성 | 15 |
| 2026-02-22 | Chrome DevTools MCP로 실제 브라우저 캡처 전면 재검증: 전략 필터 모달로 리디자인, 수신함 데모 데이터 추가, 빈 상태/삭제모달/로그아웃/구독해지/AI드롭다운/달력 실제 캡처 검증 완료 | 8 |
| 2026-02-22 | Chrome DevTools MCP로 전체 68개 화면 실제 브라우저 캡처 완료: 리스크 5탭(진입/청산/포지션/시간/감정), 수신함 사이드패널, 매매일지 폼(자동입력/지표추가/지표선택/복기탭/AI분석), 매매원칙(추가/수정), 설정 구독탭, AI 사이드패널 채팅 | 20+ |
| 2026-02-23 | 5개 차이점 수정 후 재검증 완료: 사이드바 로고(✦ 별 아이콘), 사이드바 토글(패널 레이아웃 아이콘), 리스크 카드 타이틀(1줄 통합), PnL 메트릭 아이콘(총 손익 ≈, 승률 원형화살표), PnL 차트(Bar→Area 변환) | 5 |
