# TradingView 차트 저장/불러오기 API 스펙

> **작성일**: 2026-02-24
> **요청자**: 프론트엔드
> **목적**: TradingView Charting Library의 차트 저장/불러오기 기능을 백엔드 API로 연동

---

## 1. 배경

TradingView Charting Library는 차트 데이터를 저장/불러오기 하기 위한 어댑터 인터페이스(`IExternalSaveLoadAdapter`)를 제공합니다. 현재 프론트엔드에서 `localStorage`에 임시 저장 중이며, 백엔드 API로 교체하면 **크로스 디바이스 동기화**가 가능해집니다.

### 동작 방식

```
사용자가 차트에서 "저장" 클릭
  → TradingView 위젯이 어댑터의 saveChart() 호출
  → 어댑터가 백엔드 API로 POST 요청
  → 서버가 DB에 저장 후 ID 반환

사용자가 "불러오기" 클릭
  → TradingView 위젯이 어댑터의 getAllCharts() 호출
  → 어댑터가 백엔드 API로 GET 요청
  → 저장된 차트 목록 표시
  → 선택하면 getChartContent(id) 호출 → 차트 복원
```

---

## 2. 저장 데이터 4종류

| 종류 | 설명 | 데이터 특성 | 크기 |
|------|------|------------|------|
| **Chart Layout** | 차트 레이아웃 (심볼, 타임프레임, 그리기 도구 등 전체 상태) | meta 정보 + 큰 JSON content 문자열 | 수 KB ~ 수 MB |
| **Study Template** | 지표 조합 프리셋 (예: RSI + MACD + 볼린저밴드 세트) | name + JSON content 문자열 | 수 KB |
| **Drawing Template** | 그리기 도구 설정 프리셋 (예: 트렌드라인 빨간 점선 스타일) | toolName + templateName + JSON content | 수 KB |
| **Chart Template** | 전체 차트 테마/설정 프리셋 (캔들 색상, 배경색 등) | name + JSON content 객체 | 수 KB |

### 핵심 포인트

- 모든 `content`는 **TradingView가 내부적으로 생성하는 opaque 데이터**입니다.
- 서버는 content를 **파싱하거나 가공할 필요 없이 그대로 저장/반환**하면 됩니다.
- 모든 API는 **JWT 토큰 기반 사용자별 격리**가 필요합니다.

---

## 3. API 엔드포인트

### 3-1. Chart Layout (핵심 - 1순위)

사용자가 저장한 차트 레이아웃을 관리합니다.

#### `GET /api/chart-layouts`

내 차트 레이아웃 목록 조회 (content 제외, 메타 정보만).

**Response** `200 OK`:
```json
[
  {
    "id": 1,
    "name": "BTC 1시간봉 분석",
    "symbol": "BTC/USDT",
    "resolution": "60",
    "timestamp": 1708800000000
  },
  {
    "id": 2,
    "name": "ETH 일봉 추세",
    "symbol": "ETH/USDT",
    "resolution": "1D",
    "timestamp": 1708886400000
  }
]
```

| 필드 | 타입 | 설명 |
|------|------|------|
| id | number | 차트 고유 ID |
| name | string | 사용자가 지정한 차트 이름 |
| symbol | string | 심볼 (예: "BTC/USDT") |
| resolution | string | 타임프레임 (예: "60", "1D", "1W") |
| timestamp | number | 마지막 수정 시각 (Unix ms) |

---

#### `POST /api/chart-layouts`

새 차트 레이아웃 저장.

**Request Body**:
```json
{
  "name": "BTC 1시간봉 분석",
  "symbol": "BTC/USDT",
  "resolution": "60",
  "content": "<TradingView가 생성한 JSON 문자열>"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| name | string | O | 차트 이름 |
| symbol | string | O | 심볼 |
| resolution | string | O | 타임프레임 |
| content | string | O | 차트 상태 JSON 문자열 (**최대 수 MB**) |

**Response** `201 Created`:
```json
{
  "id": 1
}
```

---

#### `PUT /api/chart-layouts/:id`

기존 차트 레이아웃 덮어쓰기 (수정).

**Request Body**: POST와 동일

**Response** `200 OK`:
```json
{
  "id": 1
}
```

---

#### `GET /api/chart-layouts/:id/content`

특정 차트의 content 조회.

**Response** `200 OK`:
```json
{
  "content": "<TradingView JSON 문자열>"
}
```

> content를 목록 API와 분리한 이유: content가 수 MB로 클 수 있어서, 목록 조회 시 불필요한 대량 데이터 전송을 방지하기 위함.

---

#### `DELETE /api/chart-layouts/:id`

차트 레이아웃 삭제.

**Response** `204 No Content`

---

### 3-2. Study Template (지표 템플릿 - 2순위)

사용자가 저장한 지표 조합 프리셋을 관리합니다.

#### `GET /api/chart-study-templates`

**Response** `200 OK`:
```json
[
  { "name": "스캘핑 세트" },
  { "name": "추세 추종 세트" }
]
```

#### `POST /api/chart-study-templates`

**Request Body**:
```json
{
  "name": "스캘핑 세트",
  "content": "<JSON 문자열>"
}
```

**Response** `201 Created`

> 동일한 name이 이미 존재하면 content를 덮어씁니다 (upsert).

#### `GET /api/chart-study-templates/:name/content`

**Response** `200 OK`:
```json
{
  "content": "<JSON 문자열>"
}
```

#### `DELETE /api/chart-study-templates/:name`

**Response** `204 No Content`

---

### 3-3. Drawing Template (그리기 도구 템플릿 - 3순위)

그리기 도구별 스타일 프리셋을 관리합니다. `toolName`으로 도구 종류를 구분합니다.

#### `GET /api/chart-drawing-templates?toolName=LineToolTrendLine`

해당 도구의 템플릿 이름 목록.

**Response** `200 OK`:
```json
["기본 스타일", "빨간 점선", "파란 실선"]
```

#### `POST /api/chart-drawing-templates`

**Request Body**:
```json
{
  "toolName": "LineToolTrendLine",
  "templateName": "빨간 점선",
  "content": "<JSON 문자열>"
}
```

**Response** `201 Created`

> 동일한 toolName + templateName이 이미 존재하면 덮어씁니다 (upsert).

#### `GET /api/chart-drawing-templates/:toolName/:templateName`

**Response** `200 OK`:
```json
{
  "content": "<JSON 문자열>"
}
```

#### `DELETE /api/chart-drawing-templates/:toolName/:templateName`

**Response** `204 No Content`

---

### 3-4. Chart Template (차트 테마 템플릿 - 3순위)

캔들 색상, 배경색 등 전체 차트 스타일 프리셋을 관리합니다.

#### `GET /api/chart-templates`

**Response** `200 OK`:
```json
["다크 테마", "심플", "컬러풀"]
```

#### `POST /api/chart-templates`

**Request Body**:
```json
{
  "name": "다크 테마",
  "content": { ... }
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| name | string | 템플릿 이름 |
| content | **JSON object** | 차트 테마 설정 (**문자열이 아닌 JSON 객체**) |

**Response** `201 Created`

> 동일한 name이 이미 존재하면 덮어씁니다 (upsert).

#### `GET /api/chart-templates/:name/content`

**Response** `200 OK`:
```json
{
  "content": { ... }
}
```

#### `DELETE /api/chart-templates/:name`

**Response** `204 No Content`

---

## 4. DB 스키마 제안

```sql
-- 1순위: 차트 레이아웃
CREATE TABLE chart_layouts (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id     BIGINT NOT NULL,
    name        VARCHAR(255) NOT NULL,
    symbol      VARCHAR(50) NOT NULL,
    resolution  VARCHAR(10) NOT NULL,
    content     LONGTEXT NOT NULL,          -- TradingView opaque JSON, 수 MB 가능
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2순위: 지표 템플릿
CREATE TABLE chart_study_templates (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id     BIGINT NOT NULL,
    name        VARCHAR(255) NOT NULL,
    content     TEXT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uk_user_name (user_id, name),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3순위: 그리기 도구 템플릿
CREATE TABLE chart_drawing_templates (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id         BIGINT NOT NULL,
    tool_name       VARCHAR(100) NOT NULL,
    template_name   VARCHAR(255) NOT NULL,
    content         TEXT NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uk_user_tool_template (user_id, tool_name, template_name),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3순위: 차트 테마 템플릿
CREATE TABLE chart_templates (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id     BIGINT NOT NULL,
    name        VARCHAR(255) NOT NULL,
    content     JSON NOT NULL,              -- JSON 객체로 저장
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uk_user_name (user_id, name),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 5. 구현 우선순위

| 순위 | 항목 | API 수 | 이유 |
|------|------|--------|------|
| **1순위** | Chart Layout | 5개 | 차트 저장/불러오기 핵심 기능. 이것만 있어도 사용 가능 |
| 2순위 | Study Template | 4개 | 지표 조합 저장. 사용 빈도 높음 |
| 3순위 | Drawing Template | 4개 | 그리기 도구 프리셋. 사용 빈도 낮음 |
| 3순위 | Chart Template | 4개 | 테마 프리셋. 사용 빈도 낮음 |

> **1순위 Chart Layout 5개 API만 완성되면** 프론트엔드에서 바로 연동 가능합니다.
> 나머지는 이후에 추가해도 됩니다 (프론트는 localStorage fallback 유지).

---

## 6. 공통 사항

### 인증
- 모든 API는 `Authorization: Bearer <JWT>` 헤더 필수
- user_id는 토큰에서 추출 (클라이언트가 보내지 않음)

### 에러 응답
```json
{
  "status": 404,
  "message": "Chart not found"
}
```

### content 처리 주의사항
- `content`는 TradingView 라이브러리가 자체 생성하는 **opaque 데이터**입니다.
- 서버는 **절대 파싱/가공하지 말고 그대로 저장/반환**해야 합니다.
- Chart Layout의 content만 **수 MB**가 될 수 있으므로 `LONGTEXT` 사용을 권장합니다.
- 나머지 content는 수 KB 수준으로 `TEXT`면 충분합니다.

### 소유권 검증
- 모든 조회/수정/삭제 시 해당 리소스가 **요청한 사용자의 것인지 확인** 필요
- 다른 사용자의 차트에 접근 시 `403 Forbidden` 반환
