# Tradex CI/CD 가이드

> **최종 업데이트**: 2026-01-26

---

## 개요

Tradex 프론트엔드는 **GitHub 레포지토리와 AWS Amplify가 연결**되어 있어서, 브랜치에 push하면 자동으로 빌드 및 배포가 진행됩니다.

별도의 배포 명령어나 작업 없이 `git push`만 하면 됩니다.

### 배포 플로우

```
git push origin develop  →  개발 서버에 자동 배포
git push origin main     →  운영 서버에 자동 배포
```

---

## 브랜치 전략

| 브랜치 | 용도 | 배포 환경 |
|--------|------|----------|
| `main` | 프로덕션 릴리즈 | AWS Amplify (prod) |
| `develop` | 개발/스테이징 | AWS Amplify (dev) |
| `feature/*` | 기능 개발 | - |
| `fix/*` | 버그 수정 | - |

### 워크플로우

1. `develop`에서 `feature/*` 또는 `fix/*` 브랜치 생성
2. 작업 완료 후 `develop`으로 PR & 머지
3. `develop` 푸시 시 개발 환경 자동 배포
4. QA 완료 후 `develop` → `main` PR 생성
5. `main` 머지 시 프로덕션 자동 배포

---

## 배포 설정

### AWS Amplify

1. AWS Amplify에서 GitHub 레포지토리 연결
2. develop 브랜치 → 개발 환경 자동 배포
3. main 브랜치 → 프로덕션 자동 배포

---

## 환경변수

### AWS Amplify

Amplify 콘솔 → 환경 변수에서 설정:

| Variable | 값 |
|----------|-----|
| `NEXT_PUBLIC_API_URL` | `https://api.tradex.so` |
| `SLACK_ERROR_WEBHOOK_URL` | Slack 웹훅 URL (500 에러 알림용) |

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
SLACK_ERROR_WEBHOOK_URL=https://hooks.slack.com/services/...
```

---

## 트러블슈팅

### AWS Amplify 배포 실패

1. Amplify 콘솔 → 빌드 기록 확인
2. 빌드 로그에서 에러 확인
3. 로컬에서 `npm run build` 테스트

---

*CI/CD 관련 문의는 DevOps 담당자에게 연락해주세요.*
