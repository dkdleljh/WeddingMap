import type { VenueDetail, VenueSummary } from "@/lib/types";

export const venueSummaries: VenueSummary[] = [
  {
    id: 1,
    name: "라비에벨 서울 컨벤션",
    slug: "laviebelle-seoul-convention",
    address: "서울 중구 세종대로 110",
    region: "서울 중구",
    meal_price_min: 72000,
    meal_price_max: 95000,
    rental_fee_min: 7000000,
    rental_fee_max: 12000000,
    trust_grade: "A",
    overall_score: 88.2,
    review_rating: 4.6,
    review_count: 124,
    is_public_hall: false,
    mood_tags: ["모던", "화려함", "호텔감성"]
  },
  {
    id: 2,
    name: "분당 가든하우스 웨딩",
    slug: "bundang-gardenhouse-wedding",
    address: "경기 성남시 분당구 정자일로 45",
    region: "경기 성남시 분당구",
    meal_price_min: 59000,
    meal_price_max: 78000,
    rental_fee_min: 5500000,
    rental_fee_max: 8000000,
    trust_grade: "A",
    overall_score: 85.7,
    review_rating: 4.5,
    review_count: 87,
    is_public_hall: false,
    mood_tags: ["야외", "자연광", "로맨틱"]
  },
  {
    id: 3,
    name: "광주 공공예식 문화원",
    slug: "gwangju-public-wedding-center",
    address: "광주 동구 예술길 18",
    region: "광주 동구",
    meal_price_min: 38000,
    meal_price_max: 52000,
    rental_fee_min: 1200000,
    rental_fee_max: 2500000,
    trust_grade: "A",
    overall_score: 84.1,
    review_rating: 4.3,
    review_count: 31,
    is_public_hall: true,
    mood_tags: ["공공", "가성비", "단정함"]
  }
];

export const venueDetails: Record<number, VenueDetail> = {
  1: {
    ...venueSummaries[0],
    description: "도심 접근성이 뛰어나고 부모님 세대와 예비부부 모두 만족도가 높은 대형 컨벤션 예식장입니다.",
    photos: [{ url: "https://images.unsplash.com/photo-1519741497674-611481863552", category: "hall" }],
    halls: [{ name: "그랜드홀", hall_type: "컨벤션", capacity_min: 250, capacity_max: 500 }],
    pricing: [{ item_name: "대관료", price_min: 7000000, price_max: 12000000 }],
    meals: [{ meal_type: "뷔페", price_per_person: 85000, is_buffet: true }],
    parking: [{ parking_slots: 500, free_minutes: 120, valet_available: true }],
    access: [{ subway_line: "2호선 시청역", subway_minutes: 3, bus_stop_name: "시청광장", bus_minutes: 2 }],
    policies: [{ policy_type: "계약", content: "90일 전 일부 환불 가능", flexibility_score: 75 }],
    reviews: [{ id: 1, venue_id: 1, title: "교통이 정말 편했습니다", content: "지하철 접근성이 뛰어나 부모님도 만족했습니다.", review_type: "visit", rating_overall: 4.7, status: "approved", is_verified: true, created_at: "2026-03-20T10:00:00" }],
    last_verified_at: "2026-03-20T10:00:00"
  },
  2: {
    ...venueSummaries[1],
    description: "하우스 웨딩 무드와 야외 사진 연출을 강조하는 예식장입니다.",
    photos: [{ url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed", category: "outdoor" }],
    halls: [{ name: "가든홀", hall_type: "하우스", capacity_min: 120, capacity_max: 220 }],
    pricing: [{ item_name: "대관료", price_min: 5500000, price_max: 8000000 }],
    meals: [{ meal_type: "코스", price_per_person: 72000, is_buffet: false }],
    parking: [{ parking_slots: 240, free_minutes: 180, valet_available: false }],
    access: [{ subway_line: "신분당선 정자역", subway_minutes: 8, bus_stop_name: "정자 카페거리", bus_minutes: 4 }],
    policies: [{ policy_type: "우천", content: "우천 시 실내 대체 가능", flexibility_score: 82 }],
    reviews: [{ id: 2, venue_id: 2, title: "야외 분위기가 좋았습니다", content: "정원이 예뻐서 사진 결과가 좋았습니다.", review_type: "contract", rating_overall: 4.6, status: "approved", is_verified: true, created_at: "2026-03-18T09:00:00" }],
    last_verified_at: "2026-03-18T09:00:00"
  },
  3: {
    ...venueSummaries[2],
    description: "공공예식장 카테고리에서 높은 가성비를 제공하는 지역 문화원형 공간입니다.",
    photos: [{ url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc", category: "hall" }],
    halls: [{ name: "문화홀", hall_type: "공공", capacity_min: 80, capacity_max: 180 }],
    pricing: [{ item_name: "대관료", price_min: 1200000, price_max: 2500000 }],
    meals: [{ meal_type: "뷔페", price_per_person: 45000, is_buffet: true }],
    parking: [{ parking_slots: 180, free_minutes: 240, valet_available: false }],
    access: [{ subway_line: "1호선 금남로4가역", subway_minutes: 6, bus_stop_name: "예술의거리", bus_minutes: 2 }],
    policies: [{ policy_type: "이용 기준", content: "공공예식장 예약 서류 확인 필요", flexibility_score: 68 }],
    reviews: [{ id: 3, venue_id: 3, title: "비용 부담이 적었습니다", content: "실속형 예식을 찾는 분에게 잘 맞습니다.", review_type: "contract", rating_overall: 4.4, status: "approved", is_verified: true, created_at: "2026-03-25T15:00:00" }],
    last_verified_at: "2026-03-25T15:00:00"
  }
};
