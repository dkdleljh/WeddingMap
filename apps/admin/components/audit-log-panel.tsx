"use client";

import { useEffect, useState } from "react";

import { getAdminAuditLogs } from "@/lib/api";
import { adminAuditLogs } from "@/lib/mock-data";
import type { AdminAuditLog } from "@/lib/types";

export function AuditLogPanel() {
  const [items, setItems] = useState<AdminAuditLog[]>(adminAuditLogs);

  useEffect(() => {
    getAdminAuditLogs().then(setItems);
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">감사 로그</h1>
        <p className="mt-2 text-sm text-stone-400">운영자가 어떤 데이터를 언제 수정했는지 최근 변경 이력을 확인합니다.</p>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-stone-400">관리자 #{item.actor_id} · {item.created_at}</p>
                <h2 className="mt-1 text-lg font-semibold">{item.action}</h2>
                <p className="mt-2 text-sm text-stone-300">
                  대상: {item.target_type} #{item.target_id ?? "-"}
                </p>
              </div>
              <pre className="overflow-x-auto rounded-2xl bg-stone-900 p-4 text-xs text-stone-300">
                {JSON.stringify(item.metadata_json || {}, null, 2)}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
