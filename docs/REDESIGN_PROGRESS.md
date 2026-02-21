# Figma 리디자인 진행 추적

> **새 Figma**: https://www.figma.com/design/6nheNQYbvBrIczlMxe54F6/Tradex_0221
> **작업 시작일**: 2026-02-21
> **마지막 업데이트**: 2026-02-21

## 요약

| Phase | 설명 | 상태 | 진행률 |
|-------|------|------|--------|
| 1 | 공통 기반 (레이아웃 + 토큰) | ✅ 완료 | 4/4 |
| 2 | 인증 페이지 | ✅ 완료 | 11/11 |
| 3 | 홈 | ✅ 완료 | 5/6 |
| 4 | Tradex AI | ✅ 완료 | 4/4 |
| 5 | 매매일지 | ✅ 완료 | 7/7 |
| 6 | 매매원칙 | ✅ 완료 | 5/5 |
| 7 | 차트 분석 | ✅ 완료 | 1/1 |
| 8 | 전략 분석 + 리스크 | ✅ 완료 | 7/7 |
| 9 | 수익관리 | ✅ 완료 | 2/2 |
| 10 | 수신함 | ✅ 완료 | 2/2 |
| 11 | 설정 | ✅ 완료 | 5/5 |
| 12 | 모달/기타 | ✅ 완료 | 5/5 |

---

## Phase 1: 공통 기반

| # | 항목 | 상태 | 파일 | 비고 |
|---|------|------|------|------|
| 1-1 | globals.css 디자인 토큰 검증 | ✅ | `src/app/globals.css` | 토큰 일치 확인, 주석 업데이트 |
| 1-2 | Sidebar | ✅ | `src/components/layout/Sidebar.tsx` | 네비 항목 정리, 스타일 매칭 |
| 1-3 | Header | ✅ | `src/components/layout/Header.tsx` | 48px, 우측 버튼 3개 |
| 1-4 | MainLayout | ✅ | `src/components/layout/MainLayout.tsx` | pt-12, bg-gray-50 |

## Phase 2: 인증 페이지

| # | 항목 | 상태 | 파일 | 비고 |
|---|------|------|------|------|
| 2-1 | 로그인 | ✅ | `src/app/(auth)/login/page.tsx` | 구조 매칭 확인 |
| 2-2 | 로그인_입력 | ✅ | (동일) | AuthLayout 통해 적용 |
| 2-3 | 로그인_실패 | ✅ | (동일) | 에러 색상 토큰화 |
| 2-4 | 회원가입 | ✅ | `src/app/(auth)/signup/page.tsx` | 에러 bg/border 토큰화 |
| 2-5 | 회원가입_입력 | ✅ | (동일) | |
| 2-6 | 회원가입_실패 | ✅ | (동일) | |
| 2-7 | 회원가입_거래소 연동 | ✅ | `src/app/(auth)/additional-info/page.tsx` | 구조 매칭 확인 |
| 2-8 | 회원가입_완료 | ✅ | (동일) | |
| 2-9 | 아이디 찾기 | ✅ | `src/app/(auth)/find-account/page.tsx` | bg-gray-50 수정 |
| 2-10 | 비밀번호 찾기 | ✅ | (동일) | |
| 2-11 | 비밀번호 재설정 | ✅ | `src/app/(auth)/reset-password/page.tsx` | bg-gray-50 수정 |

## Phase 3: 홈

| # | 항목 | 상태 | 파일 | 비고 |
|---|------|------|------|------|
| 3-1 | 홈 페이지 | ✅ | `src/app/(main)/home/page.tsx` | gap, 색상 수정 |
| 3-2 | StatCard | ✅ | `src/components/home/StatCard.tsx` | rounded-xl, border, badge 컴포넌트 |
| 3-3 | WeeklyProfitChart | ✅ | `src/components/home/WeeklyProfitChart.tsx` | gray 라인, border, shadow 제거 |
| 3-4 | RiskScoreCard | ✅ | `src/components/home/RiskScoreCard.tsx` | rounded-xl, border, shadow 제거 |
| 3-5 | TradexAIInsightCard | ✅ | `src/components/home/TradexAIInsightCard.tsx` | 녹색 그라디언트, 다크 텍스트 |
| 3-6 | 홈_사이드 패널 | ⬜ | 홈 + InboxSidePanel | Phase 10과 함께 작업 |

## Phase 4: Tradex AI

| # | 항목 | 상태 | 파일 | 비고 |
|---|------|------|------|------|
| 4-1 | Tradex AI 메인 | ✅ | `src/app/(main)/ai/page.tsx` | 높이 48px, border 토큰화 |
| 4-2 | Tradex AI 채팅 | ✅ | `src/app/(main)/ai/chat/page.tsx` | 높이 48px |
| 4-3 | 사이드 패널 | ✅ | `src/components/layout/TradexAIPanel.tsx` | border 토큰화 |
| 4-4 | 사이드 패널 채팅 | ✅ | (동일) | |

## Phase 5: 매매일지

| # | 항목 | 상태 | 파일 | 비고 |
|---|------|------|------|------|
| 5-1 | 캘린더 보기 | ✅ | `src/app/(main)/trading/journal/page.tsx` | 기존 구조 유지, 토큰 적용 |
| 5-2 | 리스트 보기 | ✅ | `src/components/trading/JournalList.tsx` | |
| 5-3 | JournalCalendar | ✅ | `src/components/trading/JournalCalendar.tsx` | |
| 5-4 | 작성(사전 시나리오)_자동 | ✅ | `src/components/trading/JournalForm.tsx` | |
| 5-5 | 작성(사전 시나리오)_수동 | ✅ | (동일) | |
| 5-6 | 작성(매매 후 복기) | ✅ | (동일) | |
| 5-7 | 오더 추가 | ✅ | (동일) | |

## Phase 6: 매매원칙

| # | 항목 | 상태 | 파일 | 비고 |
|---|------|------|------|------|
| 6-1 | 매매원칙 | ✅ | `src/app/(main)/trading/principles/page.tsx` | 기존 구조 유지, 토큰 적용 |
| 6-2 | 사이드패널 | ✅ | `src/components/trading/PrinciplesSidePanel.tsx` | |
| 6-3 | 수정 | ✅ | (principles 내) | |
| 6-4 | 추가 | ✅ | (principles 내) | |
| 6-5 | 없는 경우 | ✅ | (principles 내) | |

## Phase 7: 차트 분석

| # | 항목 | 상태 | 파일 | 비고 |
|---|------|------|------|------|
| 7-1 | 차트 분석 | ✅ | `src/app/(main)/chart/page.tsx` | 높이 48px 적용 |

## Phase 8: 전략 분석 + 리스크

| # | 항목 | 상태 | 파일 | 비고 |
|---|------|------|------|------|
| 8-1 | 전략 분석 | ✅ | `src/app/(main)/analysis/strategy/page.tsx` | 기존 Figma 토큰 적용 확인 |
| 8-2 | 커스텀 전략 필터 | ✅ | (strategy 내) | |
| 8-3 | 리스크_진입 | ✅ | `src/app/(main)/analysis/risk/page.tsx` | 기존 Figma 토큰 적용 확인 |
| 8-4 | 리스크_청산 | ✅ | (동일) | |
| 8-5 | 리스크_포지션 관리 | ✅ | (동일) | |
| 8-6 | 리스크_시간상황 | ✅ | (동일) | |
| 8-7 | 리스크_감정 | ✅ | (동일) | |

## Phase 9: 수익관리

| # | 항목 | 상태 | 파일 | 비고 |
|---|------|------|------|------|
| 9-1 | 보유 자산 | ✅ | `src/app/(main)/portfolio/assets/page.tsx` | shadow → border 변경 |
| 9-2 | 선물 거래 | ✅ | `src/app/(main)/portfolio/pnl/page.tsx` | shadow → border 변경 |

## Phase 10: 수신함

| # | 항목 | 상태 | 파일 | 비고 |
|---|------|------|------|------|
| 10-1 | 수신함 | ✅ | `src/app/(main)/inbox/page.tsx` | rounded-xl, border 변경 |
| 10-2 | 사이드패널 | ✅ | `src/components/inbox/InboxSidePanel.tsx` | |

## Phase 11: 설정

| # | 항목 | 상태 | 파일 | 비고 |
|---|------|------|------|------|
| 11-1 | 계정 설정 | ✅ | `src/components/settings/SettingsModal.tsx` | rounded-xl 적용 |
| 11-2 | 비밀번호 변경 | ✅ | (동일) | |
| 11-3 | 기본 설정 | ✅ | (동일) | |
| 11-4 | 알림 설정 | ✅ | (동일) | |
| 11-5 | 구독 설정 | ✅ | (동일) | |

## Phase 12: 모달/기타

| # | 항목 | 상태 | 파일 | 비고 |
|---|------|------|------|------|
| 12-1 | 구독 해지 모달 | ✅ | SettingsModal 내 | |
| 12-2 | 로그아웃 모달 | ✅ | Header/Sidebar 내 | |
| 12-3 | 수신함 삭제 모달 | ✅ | inbox 내 | |
| 12-4 | profile_hover | ✅ | Header 내 | |
| 12-5 | Dropdown/달력 | ✅ | DatePickerCalendar | |

## 추가 공통 변경 (전체 적용)

| 항목 | 변경 내용 | 비고 |
|------|----------|------|
| Button 컴포넌트 | 하드코딩 hex → 디자인 토큰 (gray-900, gray-300 등) | `src/components/ui/button.tsx` |
| Tabs 컴포넌트 | 하드코딩 hex → 디자인 토큰 | `src/components/ui/tabs.tsx` |
| OAuth 리다이렉트 | bg, spinner 색상 토큰화 | `src/app/oauth2/redirect/page.tsx` |
| AuthProvider | spinner 색상 토큰화 | `src/components/providers/AuthProvider.tsx` |
| 시맨틱 토큰 일괄 적용 | `text-gray-800` → `text-label-normal`, `text-gray-600` → `text-label-neutral` | 전체 페이지 파일 |
