"use client";

import { useEffect, useState, useTransition } from "react";

import { getIngestionLogs, runIngestion } from "@/lib/api";
import { ingestionLogs } from "@/lib/mock-data";
import type { IngestionLogItem } from "@/lib/types";

export function IngestionPanel() {
  const [logs, setLogs] = useState<IngestionLogItem[]>(ingestionLogs);
  const [message, setMessage] = useState("공공데이터 수집 실행과 최근 로그를 확인할 수 있습니다.");
  const [isPending, startTransition] = useTransition();

  const refresh = async () => {
    const next = await getIngestionLogs();
    setLogs(next);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">수집 실행과 로그</h1>
        <p className="mt-2 text-sm text-stone-400">{message}</p>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <button
          className="rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-stone-950"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              const result = await runIngestion();
              setMessage(`수집 작업이 실행되었습니다. 로그 번호 ${result.id}`);
              await refresh();
            })
          }
        >
          {isPending ? "실행 중..." : "공공데이터 수집 실행"}
        </button>
        <div className="mt-6 space-y-3">
          {logs.map((item) => (
            <div key={item.id} className="rounded-2xl bg-white/5 p-4 text-sm">
              <p className="font-semibold">{item.source_name}</p>
              <p className="mt-1 text-stone-400">상태: {item.status}</p>
              <p className="text-stone-400">성공 {item.success_count}건 · 실패 {item.failure_count}건</p>
              <p className="text-stone-500">{item.started_at}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
