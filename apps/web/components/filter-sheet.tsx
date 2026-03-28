import React from "react";

type Props = {
  selectedSido?: string;
  selectedSort?: string;
  keyword?: string;
};

export function FilterSheet({ selectedSido, selectedSort, keyword }: Props) {
  const chips = ["서울", "경기", "공공예식장", "가성비", "야외", "단독홀"];
  return (
    <section className="rounded-panel border border-stone-200 bg-white p-5 shadow-card">
      <form action="/explore" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">필터와 정렬</h3>
          <a href="/explore" className="text-sm font-semibold text-primary">초기화</a>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          <input name="keyword" defaultValue={keyword} className="rounded-2xl border border-stone-200 px-4 py-3 text-sm" placeholder="예식장명 또는 주소 검색" />
          <select name="sido" defaultValue={selectedSido || ""} className="rounded-2xl border border-stone-200 px-4 py-3 text-sm">
            <option value="">전체 지역</option>
            <option value="서울">서울</option>
            <option value="경기">경기</option>
            <option value="부산">부산</option>
            <option value="대구">대구</option>
            <option value="광주">광주</option>
            <option value="대전">대전</option>
          </select>
          <select name="sort" defaultValue={selectedSort || "score"} className="rounded-2xl border border-stone-200 px-4 py-3 text-sm">
            <option value="score">종합 점수순</option>
            <option value="meal_price">식대 낮은순</option>
            <option value="reviews">리뷰 많은순</option>
          </select>
          <input name="meal_price_lte" type="number" className="rounded-2xl border border-stone-200 px-4 py-3 text-sm" placeholder="최대 식대" />
        </div>
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <span key={chip} className="rounded-full border border-stone-200 px-4 py-2 text-sm text-stone-700">
              {chip}
            </span>
          ))}
          <label className="flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2 text-sm text-stone-700">
            <input name="public_only" type="checkbox" value="true" />
            공공예식장만
          </label>
          <label className="flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2 text-sm text-stone-700">
            <input name="can_outdoor" type="checkbox" value="true" />
            야외 가능
          </label>
          <label className="flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2 text-sm text-stone-700">
            <input name="is_single_hall" type="checkbox" value="true" />
            단독홀
          </label>
        </div>
        <button className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">조건 적용</button>
      </form>
    </section>
  );
}
