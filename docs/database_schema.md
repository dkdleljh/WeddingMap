# 데이터베이스 스키마

## 1. 핵심 엔티티
- User
  - 사용자 계정, 선호 지역, 예산, 예상 하객 수
- AdminUser
  - 관리자 계정과 역할
- Region
  - 시도, 시군구, 지역 코드, 좌표
- Venue
  - 예식장 기본 정보, 운영 상태, 집계 점수
- VenueHall
  - 홀별 수용 인원, 위치, 설명
- VenuePricing
  - 대관료, 옵션 비용
- VenueMeal
  - 식사 유형과 1인 가격
- VenueParking
  - 주차 대수, 무료 시간, 발렛 여부
- VenueAccess
  - 지하철, 버스, 셔틀 접근 정보
- VenuePolicy
  - 계약 정책과 유연성 점수
- VenuePhoto
  - 예식장 사진 메타데이터
- Review
  - 후기 타입, 평점, 검수 상태
- ReviewPhoto
  - 리뷰 첨부 사진
- Bookmark
  - 사용자와 예식장 찜 관계
- ComparisonSet / ComparisonSetItem
  - 비교함과 비교 대상
- Inquiry
  - 문의 내용과 상태
- DataIngestionLog
  - 수집 작업 이력
- AuditLog
  - 운영 변경 기록

## 2. 인덱스 전략
- `venues(region_id, overall_score)`
  - 지역 탐색과 정렬 최적화
- `venues(is_public_hall, is_active)`
  - 공공예식장 필터 최적화
- `users(email)`, `admin_users(email)`
  - 로그인 조회 최적화

## 3. 제약 조건
- 지역은 `sido + sigungu` 조합이 유일해야 합니다.
- 찜은 사용자와 예식장 조합이 중복될 수 없습니다.
- 비교함 항목도 같은 예식장이 중복으로 들어가면 안 됩니다.

## 4. 운영 포인트
- Venue는 탐색 성능을 위해 집계 점수와 리뷰 수를 캐시 컬럼으로 가집니다.
- 상세 정보는 하위 엔티티로 나눠 수정 단위를 작게 유지합니다.
- AuditLog는 관리자 변경 흐름을 추적하는 기반 엔티티입니다.
