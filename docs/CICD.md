# Tradex CI/CD 가이드

> **최종 업데이트**: 2026-01-18

---

## 개요

Tradex 프론트엔드의 CI/CD는 플랫폼 자동 배포를 사용합니다.

### 배포 플로우

```
develop branch (push) → Vercel Preview 배포 (자동)
main branch (push)    → AWS Amplify 배포 (자동)
```

---

## 브랜치 전략

| 브랜치 | 용도 | 배포 환경 |
|--------|------|----------|
| `main` | 프로덕션 릴리즈 | AWS Amplify |
| `develop` | 개발/스테이징 | Vercel Preview |
| `feature/*` | 기능 개발 | - |
| `fix/*` | 버그 수정 | - |

### 워크플로우

1. `develop`에서 `feature/*` 또는 `fix/*` 브랜치 생성
2. 작업 완료 후 `develop`으로 PR & 머지
3. `develop` 푸시 시 Vercel Preview 자동 배포
4. QA 완료 후 `develop` → `main` PR 생성
5. `main` 머지 시 AWS Amplify 프로덕션 자동 배포

---

## 배포 설정

### Vercel (develop)

1. [Vercel](https://vercel.com)에서 GitHub 레포지토리 연결
2. `vercel.json` 파일로 빌드 설정 관리
3. develop 브랜치 push 시 자동 Preview 배포

### AWS Amplify (main)

1. AWS Amplify에서 GitHub 레포지토리 연결
2. main 브랜치 push 시 자동 프로덕션 배포

---

## 환경변수

### Vercel

`vercel.json` 또는 Vercel 대시보드에서 설정:

| Variable | 값 |
|----------|-----|
| `NEXT_PUBLIC_API_URL` | `https://api.tradex.so` |

### AWS Amplify

Amplify 콘솔 → 환경 변수에서 설정:

| Variable | 값 |
|----------|-----|
| `NEXT_PUBLIC_API_URL` | `https://api.tradex.so` |

---

## 로컬 개발

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드 테스트
npm run build
npm run start
```

### 환경변수

```bash
# .env.local (로컬 개발)
NEXT_PUBLIC_API_URL=https://api.tradex.so
```

---

## 트러블슈팅

### Vercel 배포 실패

1. Vercel 대시보드 → Deployments → 실패한 배포 클릭
2. 빌드 로그 확인
3. 로컬에서 `npm run build` 테스트

### AWS Amplify 배포 실패

1. Amplify 콘솔 → 빌드 기록 확인
2. 빌드 로그에서 에러 확인
3. 로컬에서 `npm run build` 테스트

---

*CI/CD 관련 문의는 DevOps 담당자에게 연락해주세요.*
