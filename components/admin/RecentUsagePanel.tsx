"use client";

import { getUsageRecords } from "@/lib/usageLimiter";
import { getUsers } from "@/lib/auth";

export function RecentUsagePanel() {
  const users = getUsers();
  const records = getUsageRecords().slice(-8).reverse();
  return (
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">最近使用记录</h2>
      <div className="mt-3 grid gap-2">
        {records.length ? records.map((record) => (
          <div key={`${record.userId}-${record.date}`} className="flex justify-between rounded-md bg-slate-50 px-3 py-2 text-sm">
            <span>{users.find((user) => user.id === record.userId)?.displayName || record.userId}</span>
            <span>{record.date}｜{record.used}/{record.limit}</span>
          </div>
        )) : <p className="text-sm text-slate-500">暂无使用记录</p>}
      </div>
    </div>
  );
}
