"use client";

import { useEffect, useState, useTransition } from "react";

import { getAdminVenue, updateAdminVenue } from "@/lib/api";
import { adminVenues } from "@/lib/mock-data";
import type { AdminVenue } from "@/lib/types";

type Props = {
  venueId: number;
};

export function VenueEditForm({ venueId }: Props) {
  const [form, setForm] = useState<AdminVenue>(adminVenues.find((item) => item.id === venueId) || adminVenues[0]);
  const [message, setMessage] = useState("편집 가능한 운영 필드가 API와 연결되어 있습니다.");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getAdminVenue(venueId).then(setForm);
  }, [venueId]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">예식장 편집 #{venueId}</h1>
        <p className="mt-2 text-sm text-stone-400">{message}</p>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm text-stone-300">예식장명</span>
            <input className="rounded-2xl border border-white/10 bg-stone-900 px-4 py-3" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-stone-300">전화번호</span>
            <input className="rounded-2xl border border-white/10 bg-stone-900 px-4 py-3" value={form.phone || ""} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
          </label>
          <label className="grid gap-2 md:col-span-2">
            <span className="text-sm text-stone-300">주소</span>
            <input className="rounded-2xl border border-white/10 bg-stone-900 px-4 py-3" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
          </label>
          <label className="grid gap-2 md:col-span-2">
            <span className="text-sm text-stone-300">설명</span>
            <textarea className="min-h-36 rounded-2xl border border-white/10 bg-stone-900 px-4 py-3" value={form.description || ""} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-stone-300">신뢰도 등급</span>
            <select className="rounded-2xl border border-white/10 bg-stone-900 px-4 py-3" value={form.trust_grade} onChange={(event) => setForm({ ...form, trust_grade: event.target.value })}>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-stone-300">홀 타입</span>
            <input className="rounded-2xl border border-white/10 bg-stone-900 px-4 py-3" value={form.hall_type || ""} onChange={(event) => setForm({ ...form, hall_type: event.target.value })} />
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-stone-900 px-4 py-3">
            <input type="checkbox" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} />
            <span>운영 중</span>
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-stone-900 px-4 py-3">
            <input type="checkbox" checked={form.is_public_hall} onChange={(event) => setForm({ ...form, is_public_hall: event.target.checked })} />
            <span>공공예식장</span>
          </label>
          <button
            className="rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-stone-950 md:col-span-2"
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                const saved = await updateAdminVenue(venueId, form);
                setForm(saved);
                setMessage("예식장 정보가 저장되었습니다.");
              })
            }
          >
            {isPending ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
