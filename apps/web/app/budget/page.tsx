"use client";

import { useState } from "react";

import { SectionHeader } from "@/components/section-header";
import { calculateBudgetPreview } from "@/lib/budget";

export default function BudgetPage() {
  const [result, setResult] = useState(calculateBudgetPreview({ mealGuestCount: 220, totalBudget: 30000000, includeRentalFee: true, includeFlowerDecor: true, includeExtraOptions: true, preferredRegion: "서울", preferredStyle: "호텔" }));

  return (
    <div className="space-y-6">
      <SectionHeader title="예산 계산기" description="하객 수와 옵션 포함 여부를 바탕으로 예상 비용 구간을 계산합니다." />
      <form className="grid gap-4 rounded-panel border border-stone-200 bg-white p-6 shadow-card md:grid-cols-2" onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        setResult(calculateBudgetPreview({
          mealGuestCount: Number(formData.get("mealGuestCount")),
          totalBudget: Number(formData.get("totalBudget")),
          includeRentalFee: formData.get("includeRentalFee") === "on",
          includeFlowerDecor: formData.get("includeFlowerDecor") === "on",
          includeExtraOptions: formData.get("includeExtraOptions") === "on",
          preferredRegion: String(formData.get("preferredRegion")),
          preferredStyle: String(formData.get("preferredStyle"))
        }));
      }}>
        <input name="mealGuestCount" type="number" defaultValue={220} className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="식사 인원" />
        <input name="totalBudget" type="number" defaultValue={30000000} className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="총 예산" />
        <select name="preferredRegion" className="rounded-2xl border border-stone-200 px-4 py-3"><option>서울</option><option>경기</option><option>광주</option></select>
        <select name="preferredStyle" className="rounded-2xl border border-stone-200 px-4 py-3"><option>호텔</option><option>하우스</option><option>공공</option></select>
        <label className="flex items-center gap-2 text-sm"><input name="includeRentalFee" type="checkbox" defaultChecked /> 대관료 포함</label>
        <label className="flex items-center gap-2 text-sm"><input name="includeFlowerDecor" type="checkbox" defaultChecked /> 꽃 장식 포함</label>
        <label className="flex items-center gap-2 text-sm"><input name="includeExtraOptions" type="checkbox" defaultChecked /> 기타 옵션 포함</label>
        <button className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">계산하기</button>
      </form>
      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-panel border border-stone-200 bg-white p-5 shadow-card"><p className="text-xs text-stone-500">식대 총액</p><p className="mt-2 text-lg font-semibold">{result.mealCost.toLocaleString()}원</p></div>
        <div className="rounded-panel border border-stone-200 bg-white p-5 shadow-card"><p className="text-xs text-stone-500">대관료 추정</p><p className="mt-2 text-lg font-semibold">{result.rentalFee.toLocaleString()}원</p></div>
        <div className="rounded-panel border border-stone-200 bg-white p-5 shadow-card"><p className="text-xs text-stone-500">옵션 비용</p><p className="mt-2 text-lg font-semibold">{result.optionCost.toLocaleString()}원</p></div>
        <div className="rounded-panel border border-stone-200 bg-white p-5 shadow-card"><p className="text-xs text-stone-500">예산 적합도</p><p className="mt-2 text-lg font-semibold">{result.fitnessLabel}</p></div>
      </section>
    </div>
  );
}
