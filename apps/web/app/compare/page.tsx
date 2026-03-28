import { CompareTable } from "@/components/compare-table";
import { EmptyState } from "@/components/status-panels";
import { SectionHeader } from "@/components/section-header";
import { getComparisonItems } from "@/lib/api";

export default async function ComparePage() {
  const items = await getComparisonItems();
  return (
    <div className="space-y-6">
      <SectionHeader title="예식장 비교함" description="최대 5개까지 같은 기준으로 비교할 수 있습니다." />
      {items.length ? (
        <>
          <div className="rounded-panel border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
            {items[0].name}은 종합 점수와 리뷰 지표가 강점이고, {items[items.length - 1].name}은 예산 적합도나 공공 성격에서 비교 우위가 있을 수 있습니다.
          </div>
          <CompareTable items={items.map((item) => ({
            id: item.venue_id,
            name: item.name,
            slug: String(item.venue_id),
            address: item.address,
            region: item.region,
            meal_price_min: item.meal_price_min || 0,
            meal_price_max: item.meal_price_max || 0,
            rental_fee_min: item.rental_fee_min || 0,
            rental_fee_max: item.rental_fee_max || 0,
            trust_grade: item.trust_grade,
            overall_score: item.overall_score,
            review_rating: item.review_rating,
            review_count: item.review_count,
            is_public_hall: false,
            mood_tags: item.mood_tags,
          }))} />
        </>
      ) : (
        <EmptyState title="비교함이 비어 있습니다" description="후보 예식장을 2개 이상 담으면 가로 비교 테이블이 표시됩니다." />
      )}
    </div>
  );
}
