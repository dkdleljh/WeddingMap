# ERD 설명

## 1. 관계 요약
- Region 1:N Venue
- Venue 1:N VenueHall
- Venue 1:N VenuePricing
- Venue 1:N VenueMeal
- Venue 1:N VenueParking
- Venue 1:N VenueAccess
- Venue 1:N VenuePolicy
- Venue 1:N VenuePhoto
- Venue 1:N Review
- Review 1:N ReviewPhoto
- User 1:N Bookmark
- User 1:N ComparisonSet
- ComparisonSet 1:N ComparisonSetItem
- User 1:N Inquiry
- Venue 1:N Inquiry

## 2. 구조 해설
Venue는 탐색용 중심 엔티티입니다.  
실제 화면에서 필요한 대부분의 상세 항목은 Venue 하위 테이블로 분리해 관리합니다.  
이렇게 분리하면 운영자가 가격이나 정책만 바꾸더라도 전체 예식장 레코드를 크게 건드리지 않아도 됩니다.

## 3. 운영 관점에서 중요한 관계
- Review는 Venue 품질 평가와 신뢰도 운영에 핵심입니다.
- Inquiry는 사용자 의향 데이터를 남겨 향후 상담 전환 분석으로 확장할 수 있습니다.
- DataIngestionLog는 공공데이터 연동 성공률과 실패 원인을 추적하는 기반입니다.
- AuditLog는 관리자 액션 추적과 운영 통제를 위한 핵심 테이블입니다.
