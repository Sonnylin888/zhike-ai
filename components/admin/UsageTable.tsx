"use client";

import { getUsers } from "@/lib/auth";
import { getRemainingUsage, getUsageRecords } from "@/lib/usageLimiter";

export function UsageTable() {
  const users = getUsers();
  const records = getUsageRecords();
  const userMap = new Map(users.map((user) => [user.id, user]));

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        {users.map((user) => (
          <div key={user.id} className="rounded-lg border border-cyan-900/10 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{user.displayName}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {getRemainingUsage(user)} / {user.dailyLimit}
            </p>
            <p className="mt-1 text-xs text-slate-500">今日剩余 AI 生成次数</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-cyan-900/10 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-4">
          <h2 className="font-semibold text-slate-950">使用记录</h2>
          <p className="text-sm text-slate-500">记录保存在浏览器 localStorage，用于经销商试用阶段的轻量演示。</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-4 py-3">日期</th>
                <th className="px-4 py-3">账号</th>
                <th className="px-4 py-3">已用</th>
                <th className="px-4 py-3">上限</th>
                <th className="px-4 py-3">剩余</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.length ? (
                records.map((record) => {
                  const user = userMap.get(record.userId);
                  return (
                    <tr key={`${record.userId}-${record.date}`}>
                      <td className="px-4 py-3 text-slate-600">{record.date}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-950">{user?.displayName || record.userId}</p>
                        <p className="text-xs text-slate-500">{record.userId}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{record.used}</td>
                      <td className="px-4 py-3 text-slate-600">{record.limit}</td>
                      <td className="px-4 py-3 text-slate-600">{Math.max(0, record.limit - record.used)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="px-4 py-8 text-center text-slate-500" colSpan={5}>
                    暂无 AI 生成记录。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
