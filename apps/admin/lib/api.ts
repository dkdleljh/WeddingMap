// 관리자 앱이 실제 API 응답과 목 데이터를 함께 다룰 수 있도록 정리한 데이터 접근 모듈입니다.
import {
  adminAuditLogs,
  adminInquiries,
  adminPricings,
  adminReviews,
  adminVenues,
  dashboardData,
  ingestionLogs,
} from "@/lib/mock-data";
import type {
  AdminAuditLog,
  AdminDashboardData,
  AdminInquiry,
  AdminPricing,
  AdminReview,
  AdminVenue,
  IngestionLogItem,
} from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

async function readJson<T>(path: string, fallback: T, init?: RequestInit): Promise<T> {
  try {
    // 관리자 화면은 최신 상태가 중요하므로 캐시를 끄고 항상 서버 최신 값을 우선 조회합니다.
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
      cache: "no-store",
    });
    if (response.status === 401 || response.status === 403) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("관리자 인증이 만료되었습니다");
    }
    if (!response.ok) {
      return fallback;
    }
    const json = await response.json();
    return (json.data as T) || fallback;
  } catch (error) {
    if (error instanceof Error && error.message.includes("관리자 인증")) {
      throw error;
    }
    return fallback;
  }
}

export async function loginAdmin(email: string, password: string): Promise<{ accessToken: string; role: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("관리자 로그인에 실패했습니다");
  }

  const json = await response.json();
  const token = json.data?.access_token as string | undefined;
  const role = json.data?.role as string | undefined;
  if (!token || !role) {
    throw new Error("로그인 응답에 토큰 정보가 없습니다");
  }
  return { accessToken: token, role };
}

export async function getAdminSession(): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/auth/admin/session`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });
  return response.ok;
}

export async function logoutAdmin(): Promise<void> {
  await fetch(`${API_BASE_URL}/auth/admin/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function getDashboardData(): Promise<AdminDashboardData> {
  // 대시보드 응답은 화면 구조에 맞게 한 번 더 프론트엔드 전용 형태로 정리합니다.
  const data = await readJson<{
    kpi: Record<string, number>;
    "지역별 예식장 수": { sido: string; count: number }[];
    "최근 수집 로그": IngestionLogItem[];
  }>("/admin/dashboard", {
    kpi: {
      "등록 예식장 수": dashboardData.kpi[0].value,
      "운영 중 예식장 수": dashboardData.kpi[1].value,
      "미검수 리뷰 수": dashboardData.kpi[2].value,
      "문의 대기 건수": dashboardData.kpi[3].value,
    },
    "지역별 예식장 수": dashboardData.regionCounts,
    "최근 수집 로그": dashboardData.recentLogs,
  });

  const normalizedKpi = data?.kpi ?? {
    "등록 예식장 수": dashboardData.kpi[0].value,
    "운영 중 예식장 수": dashboardData.kpi[1].value,
    "미검수 리뷰 수": dashboardData.kpi[2].value,
    "문의 대기 건수": dashboardData.kpi[3].value,
  };

  return {
    kpi: Object.entries(normalizedKpi).map(([label, value]) => ({ label, value })),
    regionCounts: data?.["지역별 예식장 수"] ?? dashboardData.regionCounts,
    recentLogs: data?.["최근 수집 로그"] ?? dashboardData.recentLogs,
  };
}

export async function getAdminVenues(): Promise<AdminVenue[]> {
  return readJson<AdminVenue[]>("/admin/venues", adminVenues);
}

export async function getAdminVenue(id: number): Promise<AdminVenue> {
  return readJson<AdminVenue>(`/admin/venues/${id}`, adminVenues.find((item) => item.id === id) || adminVenues[0]);
}

export async function updateAdminVenue(id: number, payload: Partial<AdminVenue>): Promise<AdminVenue> {
  return readJson<AdminVenue>(`/admin/venues/${id}`, adminVenues.find((item) => item.id === id) || adminVenues[0], {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function getAdminPricings(): Promise<AdminPricing[]> {
  return readJson<AdminPricing[]>("/admin/pricings", adminPricings);
}

export async function updateAdminPricing(id: number, payload: Partial<AdminPricing>): Promise<AdminPricing> {
  return readJson<AdminPricing>(`/admin/pricings/${id}`, adminPricings.find((item) => item.id === id) || adminPricings[0], {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function getAdminReviews(): Promise<AdminReview[]> {
  return readJson<AdminReview[]>("/admin/reviews", adminReviews);
}

export async function approveAdminReview(id: number): Promise<AdminReview> {
  return readJson<AdminReview>(`/admin/reviews/${id}/approve`, adminReviews.find((item) => item.id === id) || adminReviews[0], {
    method: "PATCH",
  });
}

export async function hideAdminReview(id: number): Promise<AdminReview> {
  return readJson<AdminReview>(`/admin/reviews/${id}/hide`, adminReviews.find((item) => item.id === id) || adminReviews[0], {
    method: "PATCH",
  });
}

export async function getAdminInquiries(): Promise<AdminInquiry[]> {
  return readJson<AdminInquiry[]>("/admin/inquiries", adminInquiries);
}

export async function updateAdminInquiry(id: number, status: string): Promise<AdminInquiry> {
  return readJson<AdminInquiry>(`/admin/inquiries/${id}`, adminInquiries.find((item) => item.id === id) || adminInquiries[0], {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function getIngestionLogs(): Promise<IngestionLogItem[]> {
  return readJson<IngestionLogItem[]>("/ingestion/logs", ingestionLogs);
}

export async function runIngestion(): Promise<{ id: number; status: string }> {
  return readJson<{ id: number; status: string }>("/ingestion/run", { id: 0, status: "success" }, { method: "POST" });
}

export async function getAdminAuditLogs(): Promise<AdminAuditLog[]> {
  return readJson<AdminAuditLog[]>("/admin/audit-logs", adminAuditLogs);
}
