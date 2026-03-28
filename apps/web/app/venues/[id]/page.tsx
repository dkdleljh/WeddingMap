import Image from "next/image";

import { ReviewCard } from "@/components/review-card";
import { SectionHeader } from "@/components/section-header";
import { getVenueDetail } from "@/lib/api";

export default async function VenueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const venue = await getVenueDetail(Number(id));
  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{venue.region}</p>
          <h1 className="text-4xl font-black tracking-tight text-ink">{venue.name}</h1>
          <p className="text-sm leading-7 text-stone-600">{venue.description}</p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-emerald-50 px-4 py-2 text-emerald-700">신뢰도 {venue.trust_grade}</span>
            <span className="rounded-full bg-stone-100 px-4 py-2">검수 시점 {venue.last_verified_at?.slice(0, 10)}</span>
          </div>
        </div>
        <div className="relative min-h-72 overflow-hidden rounded-panel shadow-card">
          <Image src={venue.photos[0]?.url || "https://images.unsplash.com/photo-1519741497674-611481863552"} alt={venue.name} fill className="object-cover" />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-panel border border-stone-200 bg-white p-5 shadow-card"><p className="text-xs text-stone-500">식대</p><p className="mt-2 text-lg font-semibold">{venue.meals[0]?.price_per_person.toLocaleString()}원</p></div>
        <div className="rounded-panel border border-stone-200 bg-white p-5 shadow-card"><p className="text-xs text-stone-500">주차</p><p className="mt-2 text-lg font-semibold">{venue.parking[0]?.parking_slots}대</p></div>
        <div className="rounded-panel border border-stone-200 bg-white p-5 shadow-card"><p className="text-xs text-stone-500">교통</p><p className="mt-2 text-lg font-semibold">{venue.access[0]?.subway_line}</p></div>
        <div className="rounded-panel border border-stone-200 bg-white p-5 shadow-card"><p className="text-xs text-stone-500">정책 유연성</p><p className="mt-2 text-lg font-semibold">{venue.policies[0]?.flexibility_score}점</p></div>
      </section>

      <section>
        <SectionHeader title="홀 정보" />
        <div className="grid gap-4 md:grid-cols-2">
          {venue.halls.map((hall) => (
            <div key={hall.name} className="rounded-panel border border-stone-200 bg-white p-5 shadow-card">
              <h3 className="text-lg font-semibold">{hall.name}</h3>
              <p className="mt-2 text-sm text-stone-600">{hall.hall_type} · {hall.capacity_min}명부터 {hall.capacity_max}명</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="리뷰" description="방문 후기, 계약 후기, 진행 후기를 함께 제공합니다." />
        <div className="grid gap-4 md:grid-cols-2">
          {venue.reviews.map((review) => <ReviewCard key={review.id} review={review} />)}
        </div>
      </section>
    </div>
  );
}
