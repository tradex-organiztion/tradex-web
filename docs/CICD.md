# Tradex CI/CD 가이드

> **최종 업데이트**: 2026-01-18

---

## 개요

Tradex 프론트엔드의 CI/CD 파이프라인은 GitHub Actions를 사용하여 자동화됩니다.

### 배포 플로우

```
develop branch (push)
    ↓
Vercel Preview 배포
    ↓
PR 생성 (develop → main)
    ↓
Code Review & Merge
    ↓
main branch (push)
    ↓
Docker 이미지 빌드 → ghcr.io 푸시
    ↓
EC2 프로덕션 배포
```

---

## 브랜치 전략

| 브랜치 | 용도 | 배포 환경 |
|--------|------|----------|
| `main` | 프로덕션 릴리즈 | EC2 (Docker) |
| `develop` | 개발/스테이징 | Vercel Preview |
| `feature/*` | 기능 개발 | - |
| `fix/*` | 버그 수정 | - |

### 워크플로우

1. `develop`에서 `feature/*` 또는 `fix/*` 브랜치 생성
2. 작업 완료 후 `develop`으로 PR & 머지
3. `develop` 푸시 시 Vercel Preview 자동 배포
4. QA 완료 후 `develop` → `main` PR 생성
5. `main` 머지 시 프로덕션 자동 배포

---

## GitHub Actions 워크플로우

### 1. Develop - Vercel Preview (`develop.yml`)

**트리거**: `develop` 브랜치 push

**동작**:
1. Vercel CLI로 프리뷰 빌드
2. Vercel Preview 환경에 배포
3. PR이 있으면 프리뷰 URL 코멘트

### 2. Production - EC2 Deploy (`production.yml`)

**트리거**: `main` 브랜치 push

**동작**:
1. Docker 이미지 빌드
2. GitHub Container Registry(ghcr.io)에 푸시
3. SSH로 EC2 접속
4. docker-compose로 컨테이너 교체
5. 헬스체크

---

## 필수 설정

### GitHub Secrets

Repository Settings → Secrets and variables → Actions에서 설정:

| Secret | 설명 | 예시 |
|--------|------|------|
| `EC2_HOST` | EC2 퍼블릭 IP/도메인 | `52.78.xxx.xxx` |
| `EC2_USER` | SSH 사용자명 | `ubuntu` |
| `EC2_SSH_KEY` | SSH 프라이빗 키 (전체) | `-----BEGIN OPENSSH...` |
| `VERCEL_TOKEN` | Vercel 액세스 토큰 | `xxxxx` |
| `VERCEL_ORG_ID` | Vercel 조직 ID | `team_xxxxx` |
| `VERCEL_PROJECT_ID` | Vercel 프로젝트 ID | `prj_xxxxx` |

### GitHub Variables

Repository Settings → Secrets and variables → Actions → Variables:

| Variable | 설명 | 예시 |
|----------|------|------|
| `NEXT_PUBLIC_API_URL` | API 서버 URL | `https://api.tradex.so` |

### Vercel 설정

1. [Vercel](https://vercel.com)에서 프로젝트 생성
2. Settings → General에서 ID 확인:
   - `VERCEL_ORG_ID`: 팀/개인 ID
   - `VERCEL_PROJECT_ID`: 프로젝트 ID
3. Settings → Tokens에서 액세스 토큰 생성

### EC2 서버 설정

```bash
# Ubuntu 22.04 기준

# Docker 설치
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Docker Compose 설치 (이미 포함됨)
docker compose version

# 앱 디렉토리 생성
mkdir -p ~/tradex-web

# 방화벽 설정 (AWS Security Group에서)
# - 22 (SSH)
# - 80 (HTTP)
# - 443 (HTTPS)
# - 3000 (Next.js)
```

---

## Docker 구성

### Dockerfile

멀티스테이지 빌드로 최적화된 이미지 생성:
- **deps**: 의존성 설치
- **builder**: Next.js 빌드 (standalone)
- **runner**: 프로덕션 실행 (경량화)

### docker-compose.yml

```yaml
services:
  tradex-web:
    image: ghcr.io/tradex-organiztion/tradex-web:latest
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=https://api.tradex.so
```

---

## 로컬 테스트

### Docker 빌드 테스트

```bash
# 이미지 빌드
docker build -t tradex-web .

# 컨테이너 실행
docker run -p 3000:3000 tradex-web

# 또는 docker-compose 사용
docker compose up --build
```

### 환경변수

```bash
# .env.local (로컬 개발)
NEXT_PUBLIC_API_URL=https://api.tradex.so

# docker-compose.yml 또는 GitHub Variables (프로덕션)
NEXT_PUBLIC_API_URL=https://api.tradex.so
```

---

## 트러블슈팅

### Docker 빌드 실패

```bash
# 캐시 정리 후 재빌드
docker builder prune -af
docker build --no-cache -t tradex-web .
```

### EC2 배포 실패

```bash
# SSH 접속 테스트
ssh -i ~/.ssh/your-key.pem ubuntu@<EC2_HOST>

# 컨테이너 로그 확인
docker logs tradex-web

# 수동 배포
cd ~/tradex-web
docker compose pull
docker compose up -d
```

### Vercel 배포 실패

```bash
# 로컬에서 Vercel CLI 테스트
npm i -g vercel
vercel login
vercel --prod
```

---

## 모니터링

### 컨테이너 상태 확인

```bash
# 실행 중인 컨테이너
docker ps

# 헬스체크
curl http://localhost:3000

# 리소스 사용량
docker stats tradex-web
```

### 로그 확인

```bash
# 실시간 로그
docker logs -f tradex-web

# 최근 100줄
docker logs --tail 100 tradex-web
```

---

## 롤백

### 이전 버전으로 롤백

```bash
# EC2에서 실행
cd ~/tradex-web

# 특정 버전으로 변경
# docker-compose.yml의 image 태그를 변경
# ghcr.io/tradex-organiztion/tradex-web:latest
# → ghcr.io/tradex-organiztion/tradex-web:sha-abc1234

docker compose pull
docker compose up -d
```

### GitHub에서 이전 커밋 확인

```bash
# 이미지 태그는 커밋 SHA 기반
git log --oneline main
# sha-abc1234 형식으로 이미지 태그 사용
```

---

*CI/CD 관련 문의는 DevOps 담당자에게 연락해주세요.*
