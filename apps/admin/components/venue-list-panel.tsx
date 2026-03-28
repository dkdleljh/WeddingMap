"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getAdminVenues } from "@/lib/api";
import { adminVenues } from "@/lib/mock-data";
import type { AdminVenue } from "@/lib/types";

export function VenueListPanel() {
  const [items, setItems] = useState<AdminVenue[]>(adminVenues);

  useEffect(() => {
    getAdminVenues().then(setItems);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">예식장 목록</h1>
          <p className="mt-2 text-sm text-stone-400">운영 여부, 데이터 신뢰도, 원천 정보를 한 번에 관리합니다.</p>
        </div>
        <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-300">총 {items.length}개</div>
      </div>
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-stone-400">
            <tr>
              <th className="px-5 py-4">예식장</th>
              <th className="px-5 py-4">지역</th>
              <th className="px-5 py-4">상태</th>
              <th className="px-5 py-4">신뢰도</th>
              <th className="px-5 py-4">원천</th>
              <th className="px-5 py-4">편집</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-white/10">
                <td className="px-5 py-4">
                  <p className="font-semibold">{item.name}</p>
                  <p className="mt-1 text-stone-400">{item.address}</p>
                </td>
                <td className="px-5 py-4">{item.region_name}</td>
                <td className="px-5 py-4">{item.is_active ? "운영 중" : "중지"}</td>
                <td className="px-5 py-4">{item.trust_grade}</td>
                <td className="px-5 py-4">{item.source_type}</td>
                <td className="px-5 py-4">
                  <Link href={`/venues/${item.id}`} className="rounded-full bg-amber-400 px-4 py-2 font-semibold text-stone-950">
                    상세 편집
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
