# WeddingMap

WeddingMap은 전국 예식장을 지역, 예산, 하객 수, 식대, 교통, 주차, 분위기, 계약 조건 기준으로 비교 분석하는 소비자용 예식장 탐색 플랫폼입니다.  
이 저장소는 실제 서비스로 확장 가능한 구조를 목표로 하며, 사용자 웹앱, 관리자 웹앱, FastAPI 기반 API, 공공데이터 수집기, 샘플 데이터, 테스트, 운영 문서를 함께 제공합니다.

## 1. 프로젝트 목적
- 예비부부가 광고성 나열이 아니라 표준화된 데이터로 예식장을 비교할 수 있게 합니다.
- 지역별, 예산별, 조건별 탐색과 비교를 빠르게 수행할 수 있게 합니다.
- 공공데이터포털 기반 데이터와 운영자 보강 데이터를 함께 관리할 수 있게 합니다.
- 관리자 검수와 수집 로그를 통해 데이터 신뢰도를 운영 가능한 수준으로 끌어올립니다.

## 2. 현재 포함된 범위
- 사용자 앱
  - 홈
  - 지역별 탐색
  - 예식장 상세
  - 비교함
  - 찜
  - 예산 계산기
  - 로그인
  - 회원가입
  - 마이페이지
  - 문의
  - 리뷰 목록
  - 리뷰 작성
- 관리자 앱
  - 관리자 로그인 화면
  - 대시보드
  - 예식장 목록
  - 예식장 상세 편집
  - 가격 관리
  - 리뷰 검수
  - 문의 상태 관리
  - 수집 실행 및 로그 확인
- 백엔드 API
  - 인증 API
  - 사용자 API
  - 지역 API
  - 예식장 API
  - 리뷰 API
  - 찜 API
  - 비교함 API
  - 문의 API
  - 예산 계산 API
  - 관리자 API
  - 데이터 수집 API
- 데이터 수집기
  - 샘플 JSON 파일 수집
  - 공공데이터포털 게이트웨이형 JSON 응답 파싱 기반 구조
  - 중복 후보 요약

## 3. 기술 스택
### 사용자 앱
- Next.js
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod

### 관리자 앱
- Next.js
- TypeScript
- Tailwind CSS

### API
- FastAPI
- SQLAlchemy
- Pydantic
- JWT 인증
- PostgreSQL 운영 구조
- SQLite 개발 fallback 구조

### 수집기
- Python
- HTTPX
- 공공데이터포털 JSON 응답 파싱

### 테스트
- Pytest
- Vitest
- React Testing Library

## 4. 폴더 구조
```text
WeddingMap/
├─ apps/
│  ├─ api/                  # FastAPI 백엔드
│  ├─ web/                  # 사용자 웹앱
│  ├─ admin/                # 관리자 웹앱
│  └─ weddingmap-local.db   # 로컬 SQLite 개발 데이터베이스 실행 시 생성
├─ services/
│  └─ ingestion/            # 공공데이터 수집기, 파서, 병합 요약
├─ database/
│  └─ migrations/           # 운영용 SQL 마이그레이션
├─ docs/                    # 제품, 설계, 운영, 보안, 배포 문서
├─ infra/                   # 인프라 보조 파일
├─ sample-data/             # 개발용 샘플 예식장 데이터
├─ scripts/                 # 부트스트랩, 시드, 테스트 보조 스크립트
└─ tests/                   # 백엔드와 수집기 테스트
```

## 5. 실행 방법
### 5-1. 환경 변수 준비
```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
cp apps/admin/.env.example apps/admin/.env.local
```

### 5-2. 의존성 설치
#### Node 의존성
```bash
npm install
```

#### Python 의존성
```bash
python3 -m venv apps/api/.venv
source apps/api/.venv/bin/activate
pip install -r apps/api/requirements.txt
```

#### 가장 쉬운 자동 준비 방식
- 의존성 설치, 데이터베이스 준비, 시드 적재를 한 번에 처리하려면 아래 스크립트를 실행합니다.
- Docker가 없으면 자동으로 SQLite 개발 모드로 진행합니다.

```bash
./scripts/bootstrap.sh
```

### 5-3. 데이터베이스 준비
#### 가장 쉬운 로컬 개발 방식
- 기본값은 SQLite 개발 모드입니다.
- 별도 Docker 없이 빠르게 API를 실행하고 화면을 확인할 수 있습니다.

```bash
source apps/api/.venv/bin/activate
cd apps/api
PYTHONPATH=/mnt/c/Users/Administrator/Desktop/WeddingMap/apps/api python3 -m app.db.run_migrations
PYTHONPATH=/mnt/c/Users/Administrator/Desktop/WeddingMap/apps/api python3 -m app.db.seed
```

#### Docker 기반 운영 유사 방식
- Docker가 있는 환경에서는 `docker compose up -d postgres redis`로 PostgreSQL, Redis를 띄운 뒤 `.env`에서 PostgreSQL URL을 사용하면 됩니다.

```bash
./scripts/bootstrap.sh
./scripts/seed_all.sh
```

### 5-4. 개발 서버 실행
#### API
```bash
npm run dev:api
```

#### 사용자 웹앱
```bash
npm run dev:web
```

#### 관리자 웹앱
```bash
npm run dev:admin
```

## 6. 빌드와 테스트
### 테스트
```bash
./scripts/test_all.sh
```

### 전체 검증
- 테스트와 두 웹앱 빌드를 한 번에 실행합니다.

```bash
npm run verify
```

### 빌드만 별도로 확인
```bash
./scripts/build_all.sh
```

### 개별 테스트
```bash
npm run test:web
npm run test:admin
source apps/api/.venv/bin/activate
PYTHONPATH=apps/api python -m pytest tests/api tests/ingestion
```

### 프로덕션 빌드
```bash
npm run build:web
npm run build:admin
```

## 7. 샘플 계정
- 사용자 계정
  - 이메일: `demo@weddingmap.kr`
  - 비밀번호: `Passw0rd!`
- 관리자 계정
  - 이메일: `admin@weddingmap.kr`
  - 비밀번호: `AdminPassw0rd!`

## 8. 공공데이터포털 연동 방식
- 현재 수집기는 두 가지 경로를 지원합니다.
  - 샘플 파일 기반 실행
  - 공공데이터포털 API URL 기반 실행
- 공공데이터포털 API URL은 게이트웨이 방식 JSON 응답을 기준으로 처리합니다.
- 기본 파라미터는 `serviceKey`, `pageNo`, `numOfRows`, `resultType=json`, `type=json`을 사용합니다.
- 응답 구조는 다음 형태를 우선 지원합니다.
  - `response.body.items.item`
  - `data`
  - `records`

예시:
```bash
export APP_DATA_PORTAL_API_KEY="발급받은_일반인증키"
export DATA_PORTAL_API_URL="https://apis.data.go.kr/..."
python services/ingestion/run_ingestion.py --mode portal --url "$DATA_PORTAL_API_URL"
```

## 9. 문서 링크
- [문서 인덱스](docs/index.md)
- [제품 개요](docs/product_overview.md)
- [요구사항 정의](docs/requirements.md)
- [기술 아키텍처](docs/technical_architecture.md)
- [데이터 수집 가이드](docs/data_ingestion.md)
- [배포 가이드](docs/deployment_guide.md)
- [운영 가이드](docs/operations_guide.md)
- [보안과 개인정보](docs/security_privacy.md)
- [고도화 계획](docs/enhancement_plan.md)

## 10. 점검 결과 요약
- 불필요한 빌드 산출물과 중복 테스트를 정리했습니다.
- 공공데이터포털 연동 코드를 게이트웨이형 응답 구조 기준으로 보강했습니다.
- 관리자 CRUD API를 보강하고 관리자 앱을 실제 API 우선 구조로 정리했습니다.
- Next.js 보안 취약 공지에 맞춰 버전을 상향했습니다.
- 로컬 개발용 SQLite 경로와 운영 확장용 PostgreSQL 구조를 함께 유지했습니다.

## 11. 주의사항
- 운영 환경에서는 반드시 PostgreSQL과 Redis 기반으로 전환하는 것을 권장합니다.
- 공공데이터포털 인증키, JWT 비밀키, 지도 키는 운영용 값으로 교체해야 합니다.
- 샘플 데이터는 개발과 화면 검증 목적이며 실제 영업 정보와 다를 수 있습니다.
- 사용자 폴더에 깨진 상위 `node_modules`가 있는 환경에서도 동작하도록 루트 스크립트를 보강했습니다.

<!-- BEGIN RELEASE STATUS -->
## 최신 배포 정보

- 저장소 버전: `v0.1.2`
- [변경사항과 검증 범위](RELEASE_NOTES.md)
- [GitHub 릴리즈](https://github.com/dkdleljh/WeddingMap/releases/latest)
<!-- END RELEASE STATUS -->
