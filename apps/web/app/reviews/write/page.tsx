"use client";

import { useState } from "react";

import { createReview } from "@/lib/api";

export default function WriteReviewPage() {
  const [message, setMessage] = useState("방문 경험과 계약 경험을 구분해서 적으면 다른 사용자의 의사결정에 더 도움이 됩니다.");

  return (
    <div className="mx-auto max-w-2xl rounded-panel border border-stone-200 bg-white p-6 shadow-card">
      <h1 className="text-2xl font-bold">리뷰 작성</h1>
      <p className="mt-3 text-sm text-stone-500">{message}</p>
      <form
        className="mt-4 grid gap-3"
        onSubmit={async (event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const score = Number(formData.get("score"));
          const result = await createReview({
            venue_id: Number(formData.get("venue_id")),
            review_type: String(formData.get("review_type")),
            title: String(formData.get("title")),
            content: String(formData.get("content")),
            rating_food: score,
            rating_access: score,
            rating_parking: score,
            rating_mood: score,
            rating_contract: score,
          });
          setMessage(result.message);
          if (result.success) {
            event.currentTarget.reset();
          }
        }}
      >
        <input name="venue_id" type="number" className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="예식장 번호" defaultValue={1} required />
        <select name="review_type" className="rounded-2xl border border-stone-200 px-4 py-3">
          <option value="visit">방문 후기</option>
          <option value="contract">계약 후기</option>
          <option value="event">진행 후기</option>
          <option value="guest">하객 후기</option>
        </select>
        <input name="title" className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="리뷰 제목" required />
        <input name="score" type="number" min={1} max={5} step="1" className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="종합 점수 1~5" defaultValue={5} required />
        <textarea name="content" className="min-h-40 rounded-2xl border border-stone-200 px-4 py-3" placeholder="예식장 경험을 자세히 남겨주세요" required />
        <button className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">리뷰 등록</button>
      </form>
    </div>
  );
}
