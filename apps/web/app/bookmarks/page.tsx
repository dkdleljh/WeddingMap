import { EmptyState } from "@/components/status-panels";
import { SectionHeader } from "@/components/section-header";
import { VenueCard } from "@/components/venue-card";
import { getBookmarks } from "@/lib/api";

export default async function BookmarksPage() {
  const items = await getBookmarks();
  return (
    <div className="space-y-6">
      <SectionHeader title="찜한 예식장" description="후보군을 빠르게 다시 확인하고 비교함으로 보낼 수 있습니다." />
      {items.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((venue) => <VenueCard key={venue.venue_id} venue={{ ...venue, id: venue.venue_id, name: venue.venue_name }} />)}
        </div>
      ) : (
        <EmptyState title="찜한 예식장이 아직 없습니다" description="탐색 화면에서 마음에 드는 예식장을 찜하고 다시 돌아오세요." />
      )}
    </div>
  );
}
