export type VenueSummary = {
  id: number;
  name: string;
  slug: string;
  address: string;
  region: string;
  meal_price_min: number;
  meal_price_max: number;
  rental_fee_min: number;
  rental_fee_max: number;
  trust_grade: string;
  overall_score: number;
  review_rating: number;
  review_count: number;
  is_public_hall: boolean;
  mood_tags: string[];
};

export type UserProfile = {
  id: number;
  email: string;
  nickname: string;
  preferred_region_id: number | null;
  budget_min: number | null;
  budget_max: number | null;
  expected_guest_count: number | null;
};

export type ReviewSummary = {
  id: number;
  venue_id: number;
  title: string;
  content: string;
  review_type: string;
  rating_overall: number;
  status: string;
  is_verified: boolean;
  created_at?: string;
};

export type BookmarkItem = VenueSummary & {
  bookmark_id: number;
  venue_id: number;
  venue_name: string;
};

export type ComparisonItem = {
  venue_id: number;
  name: string;
  region: string;
  address: string;
  meal_price_min: number | null;
  meal_price_max: number | null;
  rental_fee_min: number | null;
  rental_fee_max: number | null;
  warranty_guest_min: number | null;
  warranty_guest_max: number | null;
  parking: number | null;
  overall_score: number;
  trust_grade: string;
  review_rating: number;
  review_count: number;
  mood_tags: string[];
};

export type InquiryItem = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  preferred_contact_time: string | null;
  status: string;
  venue_id: number | null;
  created_at: string;
};

export type VenueDetail = VenueSummary & {
  description: string;
  photos: { id?: number; url: string; category: string }[];
  halls: { name: string; hall_type: string; capacity_min: number; capacity_max: number }[];
  pricing: { item_name: string; price_min: number; price_max: number }[];
  meals: { meal_type: string; price_per_person: number; is_buffet: boolean }[];
  parking: { parking_slots: number; free_minutes: number; valet_available: boolean }[];
  access: { subway_line: string; subway_minutes: number; bus_stop_name: string; bus_minutes: number }[];
  policies: { policy_type: string; content: string; flexibility_score: number }[];
  reviews: ReviewSummary[];
  last_verified_at?: string | null;
};
