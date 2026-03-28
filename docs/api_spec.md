# API 명세

## 1. 기본 원칙
- 모든 API는 JSON 응답을 사용합니다.
- 성공 응답은 `success: true`를 포함합니다.
- 오류 응답은 HTTP 상태 코드와 함께 메시지를 반환합니다.
- 관리자 API는 `/api/admin` 아래에 모읍니다.

## 2. 공통 성공 응답 예시
```json
{
  "success": true,
  "data": {}
}
```

## 3. 공통 오류 응답 예시
```json
{
  "detail": "예식장을 찾을 수 없습니다"
}
```

## 4. 인증 API
### POST `/api/auth/login`
- 설명: 일반 사용자 로그인
- 요청 본문: `email`, `password`, `is_admin`

### POST `/api/auth/admin/login`
- 설명: 관리자 로그인
- 요청 본문: `email`, `password`
- 성공 시 액세스 토큰과 리프레시 토큰을 반환하고, 관리자 세션용 `httpOnly` 쿠키도 함께 설정합니다.

### GET `/api/auth/admin/session`
- 설명: 현재 관리자 세션 유효 여부 확인

### POST `/api/auth/admin/logout`
- 설명: 관리자 세션 쿠키 제거

### POST `/api/auth/register`
- 설명: 사용자 회원가입

## 5. 사용자 API
### GET `/api/users/me`
- 설명: 내 정보 조회

## 6. 지역 API
### GET `/api/regions`
- 설명: 시도, 시군구 목록 조회

## 7. 예식장 API
### GET `/api/venues`
- 설명: 예식장 목록 조회
- 주요 필터 확장 대상: 지역, 가격, 식대, 공공예식장, 단독홀 여부

### GET `/api/venues/{venue_id}`
- 설명: 예식장 상세 조회

## 8. 리뷰 API
### GET `/api/reviews`
- 설명: 리뷰 목록 조회

### POST `/api/reviews`
- 설명: 리뷰 작성

## 9. 찜 API
### GET `/api/bookmarks`
- 설명: 찜 목록 조회

### POST `/api/bookmarks/{venue_id}`
- 설명: 찜 추가

## 10. 비교함 API
### GET `/api/comparisons`
- 설명: 비교함 조회

### POST `/api/comparisons`
- 설명: 비교함 생성 또는 항목 추가

## 11. 문의 API
### GET `/api/inquiries`
- 설명: 내 문의 목록 조회

### POST `/api/inquiries`
- 설명: 문의 등록

## 12. 예산 계산 API
### POST `/api/budget/calculate`
- 설명: 입력 조건으로 예상 총비용과 예산 적합도 계산

## 13. 관리자 API
### 공통 규칙
- 모든 관리자 API는 `Authorization: Bearer {access_token}` 헤더가 필요합니다.
- 관리자 앱 브라우저 흐름에서는 `httpOnly` 세션 쿠키로도 접근할 수 있습니다.
- 토큰의 `role` 값이 `admin`이 아니면 `403`을 반환합니다.
- 비활성 관리자 계정은 접근할 수 없습니다.

### GET `/api/admin/dashboard`
- 설명: 관리자 KPI, 지역별 예식장 수, 최근 수집 로그 조회

### GET `/api/admin/venues`
- 설명: 관리자용 예식장 목록 조회

### GET `/api/admin/venues/{venue_id}`
- 설명: 관리자용 예식장 상세 조회

### PATCH `/api/admin/venues/{venue_id}`
- 설명: 예식장 운영 정보 수정

### GET `/api/admin/pricings`
- 설명: 가격 항목 목록 조회

### PATCH `/api/admin/pricings/{pricing_id}`
- 설명: 가격 항목 수정

### GET `/api/admin/reviews`
- 설명: 관리자 리뷰 목록 조회

### PATCH `/api/admin/reviews/{review_id}/approve`
- 설명: 리뷰 승인

### PATCH `/api/admin/reviews/{review_id}/hide`
- 설명: 리뷰 숨김

### GET `/api/admin/inquiries`
- 설명: 관리자 문의 목록 조회

### PATCH `/api/admin/inquiries/{inquiry_id}`
- 설명: 문의 상태 변경

### GET `/api/admin/audit-logs`
- 설명: 최근 운영 변경 이력 조회

## 14. 데이터 수집 API
### GET `/api/ingestion/logs`
- 설명: 관리자 인증 후 수집 로그 목록 조회

### POST `/api/ingestion/run`
- 설명: 관리자 인증 후 수집 작업 기록 생성

## 15. OpenAPI 문서 확인 방법
- FastAPI 실행 후 브라우저에서 `/docs`로 접속합니다.
- ReDoc 형태 문서는 `/redoc`에서 확인할 수 있습니다.
