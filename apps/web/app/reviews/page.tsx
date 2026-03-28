import { EmptyState } from "@/components/status-panels";
import { ReviewCard } from "@/components/review-card";
import { SectionHeader } from "@/components/section-header";
import { getReviews } from "@/lib/api";

export default async function ReviewsPage() {
  const reviews = await getReviews();
  return (
    <div className="space-y-6">
      <SectionHeader title="리뷰 목록" description="방문 후기, 계약 후기, 진행 후기, 하객 후기를 한눈에 확인할 수 있습니다." />
      {reviews.length ? (
        <div className="grid gap-4 md:grid-cols-2">{reviews.map((review) => <ReviewCard key={review.id} review={review} />)}</div>
      ) : (
        <EmptyState title="아직 등록된 리뷰가 없습니다" description="첫 리뷰를 남기고 다른 예비부부의 선택에 도움을 주세요." />
      )}
    </div>
  );
}
