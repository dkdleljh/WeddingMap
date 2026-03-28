import React from "react";
import Link from "next/link";

import type { VenueSummary } from "@/lib/types";

export function VenueCard({ venue }: { venue: VenueSummary }) {
  return (
    <article className="rounded-panel border border-stone-200 bg-white p-5 shadow-card transition hover:-translate-y-1">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{venue.region}</p>
          <Link href={"/venues/" + venue.id} className="mt-2 block text-xl font-semibold text-ink">
            {venue.name}
          </Link>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">신뢰도 {venue.trust_grade}</span>
      </div>
      <p className="mt-3 text-sm text-stone-500">{venue.address}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {venue.mood_tags.map((tag) => (
          <span key={tag} className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600">#{tag}</span>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-soft p-3">
          <p className="text-xs text-stone-500">식대</p>
          <p className="mt-1 font-semibold">{venue.meal_price_min.toLocaleString()}원부터</p>
        </div>
        <div className="rounded-2xl bg-stone-50 p-3">
          <p className="text-xs text-stone-500">종합 점수</p>
          <p className="mt-1 font-semibold">{venue.overall_score}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-stone-500">평점 {venue.review_rating} · 리뷰 {venue.review_count}</span>
        <div className="flex gap-2">
          <button className="rounded-full border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-700">찜</button>
          <button className="rounded-full bg-primary px-3 py-2 text-xs font-semibold text-white">비교 추가</button>
        </div>
      </div>
    </article>
  );
}
