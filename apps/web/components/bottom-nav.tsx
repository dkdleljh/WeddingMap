import Link from "next/link";

const items = [
  { href: "/", label: "홈" },
  { href: "/explore", label: "탐색" },
  { href: "/compare", label: "비교" },
  { href: "/bookmarks", label: "찜" },
  { href: "/my", label: "마이" }
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 border-t border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto grid max-w-3xl grid-cols-5 gap-2 px-4 py-3 text-center text-xs font-medium text-stone-600">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-xl px-2 py-2 hover:bg-stone-100">
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
