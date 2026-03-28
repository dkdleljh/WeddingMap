"use client";

import { useEffect, useState, useTransition } from "react";

import { getAdminPricings, updateAdminPricing } from "@/lib/api";
import { adminPricings } from "@/lib/mock-data";
import type { AdminPricing } from "@/lib/types";

export function PricingPanel() {
  const [items, setItems] = useState<AdminPricing[]>(adminPricings);
  const [message, setMessage] = useState("예식장별 가격 항목을 바로 수정할 수 있습니다.");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getAdminPricings().then(setItems);
  }, []);

  const updateRow = (id: number, patch: Partial<AdminPricing>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">가격 관리</h1>
        <p className="mt-2 text-sm text-stone-400">{message}</p>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="grid gap-4 md:grid-cols-[1.4fr_1fr_1fr_1.2fr_auto]">
              <div>
                <p className="text-sm text-stone-400">{item.venue_name}</p>
                <input className="mt-2 w-full rounded-2xl border border-white/10 bg-stone-900 px-4 py-3" value={item.item_name} onChange={(event) => updateRow(item.id, { item_name: event.target.value })} />
              </div>
              <input className="rounded-2xl border border-white/10 bg-stone-900 px-4 py-3" type="number" value={item.price_min} onChange={(event) => updateRow(item.id, { price_min: Number(event.target.value) })} />
              <input className="rounded-2xl border border-white/10 bg-stone-900 px-4 py-3" type="number" value={item.price_max} onChange={(event) => updateRow(item.id, { price_max: Number(event.target.value) })} />
              <input className="rounded-2xl border border-white/10 bg-stone-900 px-4 py-3" value={item.notes || ""} onChange={(event) => updateRow(item.id, { notes: event.target.value })} />
              <button
                className="rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-stone-950"
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    const saved = await updateAdminPricing(item.id, item);
                    updateRow(item.id, saved);
                    setMessage(`${saved.venue_name} 가격 정보가 저장되었습니다.`);
                  })
                }
              >
                저장
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
