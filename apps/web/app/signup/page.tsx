"use client";

import { useState } from "react";

import { registerUser } from "@/lib/api";

export default function SignupPage() {
  const [message, setMessage] = useState("회원가입 후 찜, 비교함, 문의 이력을 한 계정에서 관리할 수 있습니다.");

  return (
    <div className="mx-auto max-w-md rounded-panel border border-stone-200 bg-white p-6 shadow-card">
      <h1 className="text-2xl font-bold">회원가입</h1>
      <p className="mt-3 text-sm text-stone-500">{message}</p>
      <form
        className="mt-4 grid gap-3"
        onSubmit={async (event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const result = await registerUser({
            nickname: String(formData.get("nickname")),
            email: String(formData.get("email")),
            password: String(formData.get("password")),
          });
          setMessage(result.message);
          if (result.success) {
            event.currentTarget.reset();
          }
        }}
      >
        <input name="nickname" className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="닉네임" required />
        <input name="email" className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="이메일" required />
        <input name="password" className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="비밀번호" type="password" required />
        <button className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">가입하기</button>
      </form>
    </div>
  );
}
