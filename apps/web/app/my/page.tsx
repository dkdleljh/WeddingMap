import { getBookmarks, getComparisonItems, getInquiries, getUserProfile } from "@/lib/api";

export default async function MyPage() {
  const [user, bookmarks, comparisonItems, inquiries] = await Promise.all([
    getUserProfile(),
    getBookmarks(),
    getComparisonItems(),
    getInquiries(),
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">마이페이지</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-panel border border-stone-200 bg-white p-5 shadow-card">
          <h2 className="text-lg font-semibold">내 설정</h2>
          <p className="mt-2 text-sm text-stone-600">
            {user?.nickname || "데모사용자"} · 예산 {user?.budget_min?.toLocaleString() || 0}원부터 {user?.budget_max?.toLocaleString() || 0}원 · 예상 하객 {user?.expected_guest_count || 0}명
          </p>
        </div>
        <div className="rounded-panel border border-stone-200 bg-white p-5 shadow-card">
          <h2 className="text-lg font-semibold">최근 활동</h2>
          <p className="mt-2 text-sm text-stone-600">
            찜 {bookmarks.length}개, 비교함 {comparisonItems.length}개, 문의 {inquiries.length}건
          </p>
        </div>
      </div>
    </div>
  );
}
