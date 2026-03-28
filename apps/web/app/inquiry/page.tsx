"use client";

import { useState } from "react";

import { createInquiry } from "@/lib/api";

export default function InquiryPage() {
  const [message, setMessage] = useState("희망 일정, 하객 수, 예산을 함께 적으면 더 정확하게 답변받을 수 있습니다.");

  return (
    <div className="mx-auto max-w-2xl rounded-panel border border-stone-200 bg-white p-6 shadow-card">
      <h1 className="text-2xl font-bold">상담 문의</h1>
      <p className="mt-3 text-sm text-stone-500">{message}</p>
      <form
        className="mt-4 grid gap-3"
        onSubmit={async (event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const result = await createInquiry({
            user_id: 1,
            venue_id: Number(formData.get("venue_id")) || undefined,
            name: String(formData.get("name")),
            phone: String(formData.get("phone")),
            email: String(formData.get("email") || ""),
            preferred_contact_time: String(formData.get("preferred_contact_time") || ""),
            message: String(formData.get("message")),
          });
          setMessage(result.message);
          if (result.success) {
            event.currentTarget.reset();
          }
        }}
      >
        <input name="name" className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="이름" required />
        <input name="phone" className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="연락처" required />
        <input name="email" className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="이메일" />
        <input name="venue_id" type="number" className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="관심 예식장 번호" />
        <input name="preferred_contact_time" className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="연락 가능한 시간대" />
        <textarea name="message" className="min-h-40 rounded-2xl border border-stone-200 px-4 py-3" placeholder="문의 내용을 입력하세요" required />
        <button className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">문의 접수</button>
      </form>
    </div>
  );
}
