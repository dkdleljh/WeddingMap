"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { getAdminSession, logoutAdmin } from "@/lib/api";

const items = [
  ["/", "대시보드"],
  ["/venues", "예식장 목록"],
  ["/pricing", "가격 관리"],
  ["/reviews", "리뷰 검수"],
  ["/inquiries", "문의 관리"],
  ["/ingestion", "수집 로그"],
  ["/audit-logs", "감사 로그"],
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const isLoginPage = pathname === "/login";

    getAdminSession()
      .then((loggedIn) => {
        if (!loggedIn && !isLoginPage) {
          router.replace("/login");
          return;
        }
        if (loggedIn && isLoginPage) {
          router.replace("/");
          return;
        }
        setIsReady(true);
      })
      .catch(() => {
        if (!isLoginPage) {
          router.replace("/login");
          return;
        }
        setIsReady(true);
      });
  }, [pathname, router]);

  if (!isReady) {
    return <div className="min-h-screen bg-stone-950 text-white" />;
  }

  if (pathname === "/login") {
    return <div className="min-h-screen bg-stone-950 text-white">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-stone-950 text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-[240px_1fr]">
        <aside className="border-r border-white/10 bg-stone-900 p-6">
          <Link href="/" className="text-2xl font-black text-amber-300">WeddingMap 운영</Link>
          <nav className="mt-8 grid gap-2 text-sm">
            {items.map(([href, label]) => (
              <Link key={href} href={href} className="rounded-2xl px-4 py-3 text-stone-300 hover:bg-white/10 hover:text-white">{label}</Link>
            ))}
          </nav>
          <button
            className="mt-8 w-full rounded-2xl border border-white/10 px-4 py-3 text-left text-sm text-stone-300 hover:bg-white/10 hover:text-white"
            onClick={async () => {
              await logoutAdmin();
              router.replace("/login");
            }}
          >
            로그아웃
          </button>
        </aside>
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
