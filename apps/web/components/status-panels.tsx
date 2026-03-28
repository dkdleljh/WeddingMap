export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="rounded-panel border border-dashed border-stone-300 bg-white p-10 text-center"><h3 className="text-lg font-semibold">{title}</h3><p className="mt-2 text-sm text-stone-500">{description}</p></div>;
}

export function LoadingPanel() {
  return <div className="animate-pulse rounded-panel bg-stone-200 p-10 text-center text-sm text-stone-500">데이터를 불러오는 중입니다.</div>;
}

export function ErrorPanel({ message }: { message: string }) {
  return <div className="rounded-panel border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">{message}</div>;
}
