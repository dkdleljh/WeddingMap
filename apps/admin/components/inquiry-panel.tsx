"use client";

import { useEffect, useState, useTransition } from "react";

import { getAdminInquiries, updateAdminInquiry } from "@/lib/api";
import { adminInquiries } from "@/lib/mock-data";
import type { AdminInquiry } from "@/lib/types";

export function InquiryPanel() {
  const [items, setItems] = useState<AdminInquiry[]>(adminInquiries);
  const [message, setMessage] = useState("문의 상태 변경이 API와 연결됩니다.");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getAdminInquiries().then(setItems);
  }, []);

  const updateRow = (id: number, patch: Partial<AdminInquiry>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">문의 관리</h1>
        <p className="mt-2 text-sm text-stone-400">{message}</p>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="grid gap-4 lg:grid-cols-[1.8fr_220px_auto] lg:items-center">
              <div>
                <p className="text-sm text-stone-400">{item.venue_name || "미지정 예식장"} · {item.name}</p>
                <p className="mt-2 font-semibold">{item.message}</p>
                <p className="mt-2 text-sm text-stone-400">{item.phone} · {item.preferred_contact_time || "연락 가능 시간 미입력"}</p>
              </div>
              <select className="rounded-2xl border border-white/10 bg-stone-900 px-4 py-3" value={item.status} onChange={(event) => updateRow(item.id, { status: event.target.value })}>
                <option value="received">접수됨</option>
                <option value="in_progress">처리 중</option>
                <option value="resolved">처리 완료</option>
              </select>
              <button
                className="rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-stone-950"
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    const updated = await updateAdminInquiry(item.id, item.status);
                    updateRow(item.id, updated);
                    setMessage("문의 상태를 저장했습니다.");
                  })
                }
              >
                상태 저장
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
