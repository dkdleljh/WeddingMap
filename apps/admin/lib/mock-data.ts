import type {
  AdminAuditLog,
  AdminDashboardData,
  AdminInquiry,
  AdminPricing,
  AdminReview,
  AdminVenue,
  IngestionLogItem,
} from "@/lib/types";

export const dashboardData: AdminDashboardData = {
  kpi: [
    { label: "등록 예식장 수", value: 6 },
    { label: "운영 중 예식장 수", value: 6 },
    { label: "미검수 리뷰 수", value: 2 },
    { label: "문의 대기 건수", value: 1 },
  ],
  regionCounts: [
    { sido: "서울", count: 1 },
    { sido: "경기", count: 1 },
    { sido: "부산", count: 1 },
    { sido: "대구", count: 1 },
    { sido: "광주", count: 1 },
    { sido: "대전", count: 1 },
  ],
  recentLogs: [
    { id: 1, source_name: "전국결혼식장및예식장표준데이터", status: "success", success_count: 24, failure_count: 0, started_at: "2026-03-29T09:00:00" },
  ],
};

export const adminVenues: AdminVenue[] = [
  {
    id: 1,
    region_id: 1,
    region_name: "서울 중구",
    name: "라비에벨 서울 컨벤션",
    slug: "laviebelle-seoul-convention",
    address: "서울 중구 세종대로 110",
    road_address: "서울 중구 세종대로 110",
    description: "도심 접근성이 뛰어난 대형 컨벤션 예식장입니다.",
    phone: "02-123-4567",
    homepage_url: "https://example.com/venue-1",
    hall_type: "컨벤션",
    trust_grade: "A",
    source_type: "public_manual",
    is_active: true,
    is_public_hall: false,
    is_single_hall: false,
    is_simultaneous_ceremony: true,
    can_outdoor: false,
    rental_fee_min: 7000000,
    rental_fee_max: 12000000,
    meal_price_min: 68000,
    meal_price_max: 95000,
    warranty_guest_min: 200,
    warranty_guest_max: 400,
    overall_score: 4.5,
    review_rating: 4.6,
    review_count: 28,
    last_verified_at: "2026-03-28T14:20:00",
  },
  {
    id: 2,
    region_id: 2,
    region_name: "경기 성남시 분당구",
    name: "분당 가든하우스 웨딩",
    slug: "bundang-gardenhouse-wedding",
    address: "경기 성남시 분당구 정자동 15",
    road_address: "경기 성남시 분당구 정자일로 15",
    description: "정원형 야외 예식이 가능한 프리미엄 하우스 웨딩 공간입니다.",
    phone: "031-222-3344",
    homepage_url: "https://example.com/venue-2",
    hall_type: "하우스",
    trust_grade: "A",
    source_type: "manual",
    is_active: true,
    is_public_hall: false,
    is_single_hall: true,
    is_simultaneous_ceremony: false,
    can_outdoor: true,
    rental_fee_min: 5000000,
    rental_fee_max: 9000000,
    meal_price_min: 59000,
    meal_price_max: 78000,
    warranty_guest_min: 120,
    warranty_guest_max: 220,
    overall_score: 4.7,
    review_rating: 4.8,
    review_count: 19,
    last_verified_at: "2026-03-27T11:00:00",
  },
];

export const adminPricings: AdminPricing[] = [
  { id: 1, venue_id: 1, venue_name: "라비에벨 서울 컨벤션", item_name: "대관료", price_min: 7000000, price_max: 12000000, unit: "원", notes: "성수기 토요일 기준" },
  { id: 2, venue_id: 1, venue_name: "라비에벨 서울 컨벤션", item_name: "기본 연출", price_min: 1200000, price_max: 2500000, unit: "원", notes: "조명 포함" },
  { id: 3, venue_id: 2, venue_name: "분당 가든하우스 웨딩", item_name: "대관료", price_min: 5000000, price_max: 9000000, unit: "원", notes: "야외 가든 포함" },
];

export const adminReviews: AdminReview[] = [
  {
    id: 1,
    venue_id: 2,
    venue_name: "분당 가든하우스 웨딩",
    title: "야외 분위기가 뛰어났습니다",
    content: "가든 포토존과 식사 동선이 좋아서 하객 만족도가 높았습니다.",
    review_type: "visit",
    rating_overall: 4.8,
    is_verified: true,
    status: "pending",
    created_at: "2026-03-20T12:30:00",
  },
  {
    id: 2,
    venue_id: 1,
    venue_name: "라비에벨 서울 컨벤션",
    title: "주차 안내가 다소 아쉬웠습니다",
    content: "예식 시간대가 겹치면 출차 대기가 길었습니다.",
    review_type: "guest",
    rating_overall: 3.9,
    is_verified: false,
    status: "approved",
    created_at: "2026-03-18T09:10:00",
  },
];

export const adminInquiries: AdminInquiry[] = [
  {
    id: 1,
    venue_id: 1,
    venue_name: "라비에벨 서울 컨벤션",
    name: "김예비",
    phone: "010-1234-5678",
    email: "demo@weddingmap.kr",
    message: "2026년 10월 토요일 점심 예식 가능 여부를 알고 싶습니다.",
    preferred_contact_time: "평일 저녁 7시 이후",
    status: "received",
    created_at: "2026-03-25T18:40:00",
  },
];

export const ingestionLogs: IngestionLogItem[] = [
  {
    id: 1,
    source_name: "전국결혼식장및예식장표준데이터",
    status: "success",
    success_count: 24,
    failure_count: 0,
    started_at: "2026-03-29T09:00:00",
  },
];

export const adminAuditLogs: AdminAuditLog[] = [
  {
    id: 1,
    actor_type: "admin",
    actor_id: 1,
    action: "venue_update",
    target_type: "venue",
    target_id: 1,
    metadata_json: { trust_grade: "A", is_active: true },
    created_at: "2026-03-29T09:15:00",
  },
];
