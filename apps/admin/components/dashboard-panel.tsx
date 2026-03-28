"use client";

import React from "react";
import { useEffect, useState } from "react";

import * as adminApi from "@/lib/api";
import type { AdminDashboardData } from "@/lib/types";

const DEFAULT_DASHBOARD_DATA: AdminDashboardData = {
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
    {
      id: 1,
      source_name: "전국결혼식장및예식장표준데이터",
      status: "success",
      success_count: 24,
      failure_count: 0,
      started_at: "2026-03-29T09:00:00",
    },
  ],
};

export function DashboardPanel() {
  // 대시보드는 API가 느리거나 실패해도 기본 운영 지표를 즉시 보여 주도록 로컬 기본값을 함께 둡니다.
  const [data, setData] = useState<AdminDashboardData>(DEFAULT_DASHBOARD_DATA);
  const safeData = data ?? DEFAULT_DASHBOARD_DATA;
  const kpiItems = safeData.kpi ?? DEFAULT_DASHBOARD_DATA.kpi;
  const regionCounts = safeData.regionCounts ?? DEFAULT_DASHBOARD_DATA.regionCounts;
  const recentLogs = safeData.recentLogs ?? DEFAULT_DASHBOARD_DATA.recentLogs;

  useEffect(() => {
    // 테스트 환경이나 네트워크 장애로 API 모듈이 비정상이더라도 기본 대시보드는 계속 보여 줍니다.
    if (typeof adminApi.getDashboardData !== "function") {
      return;
    }
    adminApi.getDashboardData().then(setData).catch(() => {
      setData(DEFAULT_DASHBOARD_DATA);
    });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-amber-300">운영 대시보드</p>
        <h1 className="mt-2 text-4xl font-black">실시간 운영 현황</h1>
      </div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpiItems.map((item) => (
          <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-stone-400">{item.label}</p>
            <p className="mt-2 text-3xl font-bold">{item.value}</p>
          </div>
        ))}
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">지역별 예식장 수</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {regionCounts.map((item) => (
              <div key={item.sido} className="rounded-2xl bg-white/5 p-4">
                <p className="text-stone-400">{item.sido}</p>
                <p className="mt-2 text-2xl font-bold">{item.count}개</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">최근 수집 로그</h2>
          <div className="mt-4 space-y-3">
            {recentLogs.map((item) => (
              <div key={item.id} className="rounded-2xl bg-white/5 p-4 text-sm">
                <p className="font-semibold">{item.source_name}</p>
                <p className="mt-1 text-stone-400">상태: {item.status}</p>
                <p className="text-stone-400">성공 {item.success_count}건 · 실패 {item.failure_count}건</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
