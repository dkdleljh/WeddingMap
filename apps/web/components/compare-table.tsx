import type { VenueSummary } from "@/lib/types";

export function CompareTable({ items }: { items: VenueSummary[] }) {
  return (
    <div className="overflow-x-auto rounded-panel border border-stone-200 bg-white shadow-card">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-stone-50 text-stone-500">
          <tr>
            <th className="px-4 py-3">항목</th>
            {items.map((item) => (
              <th key={item.id} className="px-4 py-3">{item.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-stone-100"><td className="px-4 py-3 font-medium">지역</td>{items.map((item) => <td key={item.id} className="px-4 py-3">{item.region}</td>)}</tr>
          <tr className="border-t border-stone-100"><td className="px-4 py-3 font-medium">식대</td>{items.map((item) => <td key={item.id} className="px-4 py-3">{item.meal_price_min.toLocaleString()}원부터</td>)}</tr>
          <tr className="border-t border-stone-100"><td className="px-4 py-3 font-medium">대관료</td>{items.map((item) => <td key={item.id} className="px-4 py-3">{item.rental_fee_min.toLocaleString()}원부터</td>)}</tr>
          <tr className="border-t border-stone-100"><td className="px-4 py-3 font-medium">종합 점수</td>{items.map((item) => <td key={item.id} className="px-4 py-3">{item.overall_score}</td>)}</tr>
          <tr className="border-t border-stone-100"><td className="px-4 py-3 font-medium">신뢰도</td>{items.map((item) => <td key={item.id} className="px-4 py-3">{item.trust_grade}</td>)}</tr>
        </tbody>
      </table>
    </div>
  );
}
