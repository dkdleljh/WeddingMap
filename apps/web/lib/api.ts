// 사용자 웹앱이 API를 우선 사용하고, 실패하면 샘플 데이터로 최소 기능을 유지하도록 돕는 모듈입니다.
import { venueDetails, venueSummaries } from "@/lib/mock-data";
import type { BookmarkItem, ComparisonItem, InquiryItem, ReviewSummary, UserProfile, VenueDetail, VenueSummary } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

type VenueQuery = {
  sido?: string;
  sigungu?: string;
  keyword?: string;
  public_only?: boolean;
  hall_type?: string;
  can_outdoor?: boolean;
  is_single_hall?: boolean;
  meal_price_lte?: number;
  rental_fee_lte?: number;
  sort?: string;
};

function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });
  const text = query.toString();
  return text ? `?${text}` : "";
}

export async function getVenueList(filters: VenueQuery = {}): Promise<VenueSummary[]> {
  try {
    // 목록 화면은 자주 열리므로 짧은 재검증 시간을 둬서 서버 부담과 최신성 사이의 균형을 맞춥니다.
    const response = await fetch(`${API_BASE_URL}/venues${buildQueryString(filters)}`, { next: { revalidate: 60 } });
    if (!response.ok) {
      return venueSummaries;
    }
    const json = await response.json();
    return json.data.items || venueSummaries;
  } catch {
    return venueSummaries;
  }
}

export async function getVenueDetail(id: number): Promise<VenueDetail> {
  try {
    // 상세 화면도 서버 응답이 실패하면 샘플 상세 데이터를 사용해 UI가 깨지지 않게 유지합니다.
    const response = await fetch(`${API_BASE_URL}/venues/${id}`, { next: { revalidate: 60 } });
    if (!response.ok) {
      return venueDetails[id] || venueDetails[1];
    }
    const json = await response.json();
    return json.data;
  } catch {
    return venueDetails[id] || venueDetails[1];
  }
}

export async function getBookmarks(userId = 1): Promise<BookmarkItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/bookmarks${buildQueryString({ user_id: userId })}`, { cache: "no-store" });
    if (!response.ok) {
      return [];
    }
    const json = await response.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export async function getComparisonItems(userId = 1): Promise<ComparisonItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/comparisons${buildQueryString({ user_id: userId })}`, { cache: "no-store" });
    if (!response.ok) {
      return [];
    }
    const json = await response.json();
    return json.data?.items || [];
  } catch {
    return [];
  }
}

export async function getReviews(venueId?: number): Promise<ReviewSummary[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews${buildQueryString({ venue_id: venueId })}`, { cache: "no-store" });
    if (!response.ok) {
      return Object.values(venueDetails).flatMap((venue) => venue.reviews);
    }
    const json = await response.json();
    return json.data || [];
  } catch {
    return Object.values(venueDetails).flatMap((venue) => venue.reviews);
  }
}

export async function getUserProfile(userId = 1): Promise<UserProfile | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/me${buildQueryString({ user_id: userId })}`, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }
    const json = await response.json();
    return json.data || null;
  } catch {
    return null;
  }
}

export async function getInquiries(userId = 1): Promise<InquiryItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/inquiries${buildQueryString({ user_id: userId })}`, { cache: "no-store" });
    if (!response.ok) {
      return [];
    }
    const json = await response.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export async function createInquiry(payload: {
  user_id?: number;
  venue_id?: number;
  name: string;
  phone: string;
  email?: string;
  message: string;
  preferred_contact_time?: string;
}): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    return { success: false, message: "문의 접수에 실패했습니다." };
  }
  const json = await response.json();
  return { success: true, message: json.message || "문의가 접수되었습니다." };
}

export async function createReview(payload: {
  venue_id: number;
  review_type: string;
  title: string;
  content: string;
  rating_food: number;
  rating_access: number;
  rating_parking: number;
  rating_mood: number;
  rating_contract: number;
}): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    return { success: false, message: "리뷰 등록에 실패했습니다." };
  }
  const json = await response.json();
  return { success: true, message: json.message || "리뷰가 등록되었습니다." };
}

export async function loginUser(email: string, password: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    return { success: false, message: "로그인에 실패했습니다." };
  }
  return { success: true, message: "로그인에 성공했습니다. 실제 서비스에서는 세션 저장이 연결됩니다." };
}

export async function registerUser(payload: { email: string; password: string; nickname: string }): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await response.json().catch(() => null);
  if (!response.ok) {
    return { success: false, message: json?.detail || "회원가입에 실패했습니다." };
  }
  return { success: true, message: json?.message || "회원가입이 완료되었습니다." };
}
