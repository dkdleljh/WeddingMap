import Link from "next/link";

import { SectionHeader } from "@/components/section-header";
import { VenueCard } from "@/components/venue-card";
import { getVenueList } from "@/lib/api";

export default async function HomePage() {
  const venues = await getVenueList();
  return (
    <div className="space-y-8">
      <section className="rounded-panel bg-[radial-gradient(circle_at_top_left,_#fef3c7,_#ffffff_45%,_#ccfbf1)] p-6 shadow-card md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">전국 예식장 비교 분석</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-black tracking-tight text-ink md:text-5xl">광고보다 데이터로 고르는 예식장 탐색 앱</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">지역, 예산, 식대, 주차, 분위기, 계약 유연성을 같은 기준으로 비교하고 공공예식장까지 함께 탐색하세요.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/explore" className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">지역별 탐색 시작</Link>
          <Link href="/budget" className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700">예산 계산기</Link>
        </div>
      </section>

      <section>
        <SectionHeader title="인기 예식장" description="많이 비교되고 찜된 예식장을 먼저 확인하세요." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {venues.map((venue) => <VenueCard key={venue.id} venue={venue} />)}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { title: "추천 예식장", body: "최근 검색 추세와 가성비 점수를 바탕으로 추천합니다." },
          { title: "공공예식장", body: "서울시와 지역 공공시설 기반 예식장을 별도 카테고리로 제공합니다." },
          { title: "최근 본 예식장", body: "최근 검토한 후보를 빠르게 다시 확인할 수 있습니다." }
        ].map((card) => (
          <div key={card.title} className="rounded-panel border border-stone-200 bg-white p-5 shadow-card">
            <h3 className="text-lg font-semibold">{card.title}</h3>
            <p className="mt-2 text-sm text-stone-600">{card.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
