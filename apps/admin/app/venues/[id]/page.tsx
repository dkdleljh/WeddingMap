import { VenueEditForm } from "@/components/venue-edit-form";

export default async function AdminVenueEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <VenueEditForm venueId={Number(id)} />;
}
