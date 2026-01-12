# 인증 (Auth) 기획/스펙 문서

> **상태**: `작성중`
> **최종 수정**: 2024-12-22
> **담당자**: -

---

## 1. 개요

### 1.1 목적
사용자 인증 및 계정 관리 기능을 제공하여 개인화된 서비스 이용을 가능하게 합니다.

### 1.2 사용자 스토리
- As a 신규 사용자, I want to 간편하게 회원가입, so that 서비스를 빠르게 시작할 수 있다.
- As a 기존 사용자, I want to 소셜 로그인, so that 비밀번호 없이 빠르게 로그인할 수 있다.
- As a 사용자, I want to 추가 정보 입력, so that 맞춤형 서비스를 받을 수 있다.

---

## 2. 기능 요구사항

### 2.1 필수 기능 (Must Have)
- [ ] 소셜 로그인 (Google, Apple)
- [ ] 이메일/비밀번호 로그인
- [ ] 회원가입
- [ ] 추가 정보 입력 (온보딩)
- [ ] 로그아웃
- [ ] 토큰 관리 (Access/Refresh)

### 2.2 선택 기능 (Nice to Have)
- [ ] 비밀번호 찾기
- [ ] 이메일 인증
- [ ] 2단계 인증 (2FA)

### 2.3 제외 범위 (Out of Scope)
- 전화번호 인증
- SMS 로그인

---

## 3. 화면 설계

### 3.1 화면 목록

| 화면명 | 경로 | 설명 |
|--------|------|------|
| 로그인 | `/auth/login` | 로그인 폼 + 소셜 로그인 |
| 회원가입 | `/auth/signup` | 회원가입 폼 + 소셜 가입 |
| 온보딩 | `/auth/onboarding` | 추가 정보 입력 |

### 3.2 화면 구성

#### 로그인 화면
```
┌─────────────────────────────┐
│           Logo              │
├─────────────────────────────┤
│                             │
│   ┌─────────────────────┐   │
│   │ 이메일              │   │
│   └─────────────────────┘   │
│   ┌─────────────────────┐   │
│   │ 비밀번호            │   │
│   └─────────────────────┘   │
│                             │
│   [      로그인 버튼     ]   │
│                             │
│   ─────── 또는 ──────       │
│                             │
│   [G] Google로 계속하기     │
│   [] Apple로 계속하기      │
│                             │
│   회원가입 | 비밀번호 찾기   │
└─────────────────────────────┘
```

#### 회원가입 화면
```
┌─────────────────────────────┐
│           Logo              │
├─────────────────────────────┤
│                             │
│   ┌─────────────────────┐   │
│   │ 이메일              │   │
│   └─────────────────────┘   │
│   ┌─────────────────────┐   │
│   │ 비밀번호            │   │
│   └─────────────────────┘   │
│   ┌─────────────────────┐   │
│   │ 비밀번호 확인       │   │
│   └─────────────────────┘   │
│                             │
│   [ ] 서비스 약관 동의      │
│   [ ] 개인정보 처리방침 동의│
│                             │
│   [     회원가입 버튼    ]   │
│                             │
│   ─────── 또는 ──────       │
│                             │
│   [G] Google로 가입하기     │
│   [] Apple로 가입하기      │
│                             │
│   이미 계정이 있으신가요?    │
└─────────────────────────────┘
```

#### 온보딩 화면
```
┌─────────────────────────────┐
│     프로필 설정 (1/3)       │
├─────────────────────────────┤
│                             │
│        [프로필 이미지]       │
│        이미지 변경           │
│                             │
│   ┌─────────────────────┐   │
│   │ 닉네임              │   │
│   └─────────────────────┘   │
│                             │
│   주로 거래하는 자산은?      │
│   [ ] 국내주식              │
│   [ ] 해외주식              │
│   [ ] 암호화폐              │
│   [ ] 선물/옵션             │
│                             │
│   [        다음        ]    │
│   건너뛰기                   │
└─────────────────────────────┘
```

### 3.3 상태별 화면
- **기본 상태**: 폼 입력 대기
- **로딩 상태**: 버튼 로딩 스피너, 입력 비활성화
- **에러 상태**: 인라인 에러 메시지 표시
- **성공 상태**: 리다이렉트

---

## 4. 데이터 모델

### 4.1 주요 엔티티

```typescript
interface User {
  id: string;
  email: string;
  nickname: string;
  profileImage?: string;
  provider: 'email' | 'google' | 'apple';
  createdAt: string;
  updatedAt: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

interface OnboardingData {
  nickname: string;
  profileImage?: File;
  tradingAssets: string[];
}
```

### 4.2 API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/auth/login` | 이메일 로그인 |
| POST | `/auth/signup` | 회원가입 |
| POST | `/auth/social/{provider}` | 소셜 로그인 |
| POST | `/auth/refresh` | 토큰 갱신 |
| POST | `/auth/logout` | 로그아웃 |
| PUT | `/auth/onboarding` | 온보딩 정보 저장 |

---

## 5. 비즈니스 로직

### 5.1 주요 로직
1. **소셜 로그인**: OAuth 플로우 → 서버 토큰 교환 → 세션 생성
2. **신규 회원 판별**: 서버 응답의 `isNewUser` 플래그로 온보딩 리다이렉트
3. **토큰 갱신**: Access Token 만료 5분 전 자동 갱신

### 5.2 유효성 검사
- **이메일**: 이메일 형식 검증
- **비밀번호**: 최소 8자, 영문+숫자+특수문자 포함
- **닉네임**: 2-20자, 특수문자 제외

### 5.3 예외 처리
| 에러 코드 | 상황 | 대응 |
|----------|------|------|
| 401 | 인증 실패 | 에러 메시지 표시 |
| 409 | 이메일 중복 | "이미 가입된 이메일입니다" |
| 422 | 유효성 검사 실패 | 필드별 에러 표시 |

---

## 6. 컴포넌트 설계

### 6.1 컴포넌트 구조

```
components/features/auth/
├── LoginForm.tsx
├── SignupForm.tsx
├── OnboardingForm.tsx
├── SocialLoginButtons.tsx
├── AuthInput.tsx
└── hooks/
    ├── useLogin.ts
    ├── useSignup.ts
    └── useOnboarding.ts
```

### 6.2 Props 정의

```typescript
interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

interface SocialLoginButtonsProps {
  mode: 'login' | 'signup';
  onSuccess?: (user: User) => void;
}
```

---

## 7. 상태 관리

### 7.1 로컬 상태
- 폼 입력값 (email, password, ...)
- 유효성 검사 에러
- 로딩 상태

### 7.2 전역 상태 (Zustand)
```typescript
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}
```

### 7.3 서버 상태 (TanStack Query)
- 로그인 mutation
- 회원가입 mutation
- 사용자 정보 조회 query

---

## 8. 의존성

### 8.1 내부 의존성
- `lib/api/auth.ts`: API 함수
- `stores/useAuthStore.ts`: 인증 상태
- `components/ui/`: Input, Button 등

### 8.2 외부 의존성
- `next-auth` 또는 커스텀 인증
- `zod`: 유효성 검사
- `@tanstack/react-query`: 서버 상태

---

## 9. 테스트 계획

### 9.1 단위 테스트
- [ ] 이메일 유효성 검사
- [ ] 비밀번호 유효성 검사
- [ ] 토큰 만료 체크

### 9.2 통합 테스트
- [ ] 로그인 플로우
- [ ] 회원가입 플로우
- [ ] 토큰 갱신 플로우

### 9.3 E2E 테스트
- [ ] 이메일 로그인 → 홈 이동
- [ ] 소셜 로그인 → 신규 회원 → 온보딩
- [ ] 토큰 만료 → 자동 갱신

---

## 10. 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|----------|--------|
| 0.1 | 2024-12-22 | 초안 작성 | - |

---

## 11. 미결 사항 / 질문

- [ ] 소셜 로그인 제공자 최종 확정 (Google, Apple, Kakao?)
- [ ] 비밀번호 복잡도 정책 확정
- [ ] 온보딩 필수 여부 확정

---

## 12. 참고 자료

- [User Flow - Login & Signup](../../USER_FLOW.md#2-login--signup-인증)
- [Architecture](../../ARCHITECTURE.md)
