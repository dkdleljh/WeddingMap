"use client";

import { useEffect, useState, useTransition } from "react";

import { approveAdminReview, getAdminReviews, hideAdminReview } from "@/lib/api";
import { adminReviews } from "@/lib/mock-data";
import type { AdminReview } from "@/lib/types";

export function ReviewPanel() {
  const [items, setItems] = useState<AdminReview[]>(adminReviews);
  const [message, setMessage] = useState("리뷰 승인과 숨김 처리가 API로 반영됩니다.");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getAdminReviews().then(setItems);
  }, []);

  const replaceItem = (next: AdminReview) => {
    setItems((prev) => prev.map((item) => (item.id === next.id ? next : item)));
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">리뷰 검수</h1>
        <p className="mt-2 text-sm text-stone-400">{message}</p>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm text-stone-400">{item.venue_name} · {item.review_type}</p>
                <h2 className="mt-1 text-xl font-semibold">{item.title}</h2>
                <p className="mt-3 text-stone-300">{item.content}</p>
                <p className="mt-3 text-sm text-stone-400">평점 {item.rating_overall} · 상태 {item.status}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="rounded-full border border-white/10 px-4 py-2"
                  disabled={isPending}
                  onClick={() =>
                    startTransition(async () => {
                      const updated = await hideAdminReview(item.id);
                      replaceItem(updated);
                      setMessage("리뷰를 숨김 처리했습니다.");
                    })
                  }
                >
                  숨김
                </button>
                <button
                  className="rounded-full bg-emerald-400 px-4 py-2 font-semibold text-stone-950"
                  disabled={isPending}
                  onClick={() =>
                    startTransition(async () => {
                      const updated = await approveAdminReview(item.id);
                      replaceItem(updated);
                      setMessage("리뷰를 승인했습니다.");
                    })
                  }
                >
                  승인
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
