"use client";

import { useState } from "react";

import { loginUser } from "@/lib/api";

export default function LoginPage() {
  const [message, setMessage] = useState("데모 계정으로 로그인 흐름을 확인할 수 있습니다.");

  return (
    <div className="mx-auto max-w-md rounded-panel border border-stone-200 bg-white p-6 shadow-card">
      <h1 className="text-2xl font-bold">로그인</h1>
      <p className="mt-3 text-sm text-stone-500">{message}</p>
      <form
        className="mt-4 grid gap-3"
        onSubmit={async (event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const result = await loginUser(String(formData.get("email")), String(formData.get("password")));
          setMessage(result.message);
        }}
      >
        <input name="email" className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="이메일" defaultValue="demo@weddingmap.kr" required />
        <input name="password" className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="비밀번호" type="password" defaultValue="Passw0rd!" required />
        <button className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">로그인</button>
      </form>
    </div>
  );
}
