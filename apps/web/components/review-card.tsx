export function ReviewCard({ review }: { review: { title: string; content: string; rating_overall: number; review_type: string; is_verified: boolean } }) {
  return (
    <article className="rounded-panel border border-stone-200 bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{review.title}</h3>
        <span className="text-sm font-semibold text-primary">{review.rating_overall}</span>
      </div>
      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-stone-400">{review.review_type}</p>
      <p className="mt-3 text-sm leading-6 text-stone-600">{review.content}</p>
      <p className="mt-4 text-xs text-stone-500">{review.is_verified ? "인증 리뷰" : "일반 리뷰"}</p>
    </article>
  );
}
