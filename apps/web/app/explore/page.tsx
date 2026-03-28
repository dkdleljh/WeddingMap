import { FilterSheet } from "@/components/filter-sheet";
import { SectionHeader } from "@/components/section-header";
import { VenueCard } from "@/components/venue-card";
import { getVenueList } from "@/lib/api";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const venues = await getVenueList({
    sido: typeof params.sido === "string" ? params.sido : undefined,
    keyword: typeof params.keyword === "string" ? params.keyword : undefined,
    public_only: params.public_only === "true",
    can_outdoor: params.can_outdoor === "true" ? true : undefined,
    is_single_hall: params.is_single_hall === "true" ? true : undefined,
    meal_price_lte: typeof params.meal_price_lte === "string" && params.meal_price_lte ? Number(params.meal_price_lte) : undefined,
    sort: typeof params.sort === "string" ? params.sort : "score",
  });
  return (
    <div className="space-y-6">
      <SectionHeader title="지역별 탐색" description="지도와 리스트를 오가며 예산과 조건에 맞는 예식장을 압축하세요." />
      <FilterSheet
        selectedSido={typeof params.sido === "string" ? params.sido : undefined}
        selectedSort={typeof params.sort === "string" ? params.sort : "score"}
        keyword={typeof params.keyword === "string" ? params.keyword : undefined}
      />
      <section className="rounded-panel border border-stone-200 bg-white p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-stone-500">총 {venues.length}개 예식장</p>
          <p className="text-sm text-stone-500">필터 조건이 적용된 결과입니다.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {venues.map((venue) => <VenueCard key={venue.id} venue={venue} />)}
        </div>
      </section>
    </div>
  );
}
