export type KpiItem = {
  label: string;
  value: number;
};

export type RegionCountItem = {
  sido: string;
  count: number;
};

export type IngestionLogItem = {
  id: number;
  source_name: string;
  status: string;
  success_count: number;
  failure_count: number;
  started_at: string;
};

export type AdminDashboardData = {
  kpi: KpiItem[];
  regionCounts: RegionCountItem[];
  recentLogs: IngestionLogItem[];
};

export type AdminVenue = {
  id: number;
  region_id: number;
  region_name: string;
  name: string;
  slug: string;
  address: string;
  road_address: string | null;
  description: string | null;
  phone: string | null;
  homepage_url: string | null;
  hall_type: string | null;
  trust_grade: string;
  source_type: string;
  is_active: boolean;
  is_public_hall: boolean;
  is_single_hall: boolean;
  is_simultaneous_ceremony: boolean;
  can_outdoor: boolean;
  rental_fee_min: number | null;
  rental_fee_max: number | null;
  meal_price_min: number | null;
  meal_price_max: number | null;
  warranty_guest_min: number | null;
  warranty_guest_max: number | null;
  overall_score: number;
  review_rating: number;
  review_count: number;
  last_verified_at: string | null;
};

export type AdminPricing = {
  id: number;
  venue_id: number;
  venue_name: string;
  item_name: string;
  price_min: number;
  price_max: number;
  unit: string;
  notes: string | null;
};

export type AdminReview = {
  id: number;
  venue_id: number;
  venue_name: string;
  title: string;
  content: string;
  review_type: string;
  rating_overall: number;
  is_verified: boolean;
  status: string;
  created_at: string;
};

export type AdminInquiry = {
  id: number;
  venue_id: number | null;
  venue_name: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  preferred_contact_time: string | null;
  status: string;
  created_at: string;
};

export type AdminAuditLog = {
  id: number;
  actor_type: string;
  actor_id: number | null;
  action: string;
  target_type: string;
  target_id: number | null;
  metadata_json: Record<string, unknown> | null;
  created_at: string;
};
