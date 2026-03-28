import Link from "next/link";
import { ReactNode } from "react";

import { BottomNav } from "@/components/bottom-nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col bg-gradient-to-b from-amber-50 via-stone-50 to-white">
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-bold tracking-tight text-primary">
            WeddingMap
          </Link>
          <Link href="/explore" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
            예식장 찾기
          </Link>
        </div>
      </header>
      <main className="flex-1 px-4 pb-24 pt-6 md:px-6">{children}</main>
      <BottomNav />
    </div>
  );
}
