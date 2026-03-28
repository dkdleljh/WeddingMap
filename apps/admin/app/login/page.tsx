"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { loginAdmin } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@weddingmap.kr");
  const [password, setPassword] = useState("AdminPassw0rd!");
  const [message, setMessage] = useState("개발용 관리자 계정이 기본 입력되어 있습니다.");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="mx-auto mt-20 max-w-md rounded-3xl border border-white/10 bg-white/5 p-6">
      <h1 className="text-2xl font-bold">관리자 로그인</h1>
      <p className="mt-3 text-sm text-stone-400">{message}</p>
      <div className="mt-4 grid gap-3">
        <input className="rounded-2xl border border-white/10 bg-stone-900 px-4 py-3" placeholder="이메일" value={email} onChange={(event) => setEmail(event.target.value)} />
        <input className="rounded-2xl border border-white/10 bg-stone-900 px-4 py-3" placeholder="비밀번호" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <button
          className="rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-stone-950"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              try {
                await loginAdmin(email, password);
                router.replace("/");
              } catch {
                setMessage("이메일 또는 비밀번호를 확인해 주세요.");
              }
            })
          }
        >
          {isPending ? "로그인 중..." : "로그인"}
        </button>
      </div>
    </div>
  );
}
