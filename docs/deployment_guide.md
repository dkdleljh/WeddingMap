# 배포 가이드

## 1. 배포 전략
WeddingMap은 다음 세 환경을 기준으로 운영합니다.
- 로컬 개발 환경
- 스테이징 환경
- 운영 환경

## 2. 로컬 개발 환경
### 가장 빠른 방법
- API는 SQLite fallback으로 실행
- 웹과 관리자는 Next.js 개발 서버로 실행
- `./scripts/bootstrap.sh` 한 번으로 의존성 설치, 마이그레이션, 시드 적재까지 끝낼 수 있음

### 장점
- Docker가 없어도 바로 실행 가능
- 화면과 API를 빠르게 확인 가능

### 권장 실행 순서
```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
cp apps/admin/.env.example apps/admin/.env.local
./scripts/bootstrap.sh
npm run dev:api
npm run dev:web
npm run dev:admin
```

## 3. 스테이징 환경
- PostgreSQL 사용
- Redis 사용
- 샘플 또는 일부 운영 데이터 적재
- 관리자 기능과 수집기 연결 검증

## 4. 운영 환경
- PostgreSQL 관리형 서비스 사용 권장
- Redis 관리형 서비스 사용 권장
- API는 프로세스 매니저 또는 컨테이너 기반 배포
- 웹과 관리자는 독립 배포 또는 동일 프록시 뒤에서 분리 운영

## 5. Docker 기준
프로젝트 루트의 `docker-compose.yml`은 다음 서비스를 기준으로 구성됩니다.
- postgres
- redis
- api
- web
- admin

실행:
```bash
docker compose up --build
```

## 6. 배포 전 체크리스트
- 환경 변수 교체
- JWT 비밀키 교체
- 공공데이터포털 인증키 교체
- 지도 키 교체
- `npm run verify` 통과
- `./scripts/build_all.sh` 통과

## 7. 권장 개선
- 운영 환경용 reverse proxy 설정 추가
- HTTPS와 보안 헤더 적용
- 로그 수집과 모니터링 도구 연결
