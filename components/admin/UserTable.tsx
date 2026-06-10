"use client";

import { Button } from "@/components/ui/button";
import { getUsers, saveUsers, type ZhikeUser } from "@/lib/auth";

type UserTableProps = {
  users: ZhikeUser[];
  onEdit?: (user: ZhikeUser) => void;
  onChanged?: () => void;
};

export function UserTable({ users, onEdit, onChanged }: UserTableProps) {
  function toggleUser(user: ZhikeUser) {
    saveUsers(getUsers().map((item) => (item.id === user.id ? { ...item, enabled: !item.enabled } : item)));
    onChanged?.();
  }

  return (
    <div className="overflow-hidden rounded-lg border border-cyan-900/10 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-4">
        <h2 className="font-semibold text-slate-950">账号列表</h2>
        <p className="text-sm text-slate-500">用于经销商、学校试用和演示账号管理。</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="px-4 py-3">账号</th>
              <th className="px-4 py-3">角色</th>
              <th className="px-4 py-3">水印</th>
              <th className="px-4 py-3">每日次数</th>
              <th className="px-4 py-3">模型</th>
              <th className="px-4 py-3">状态</th>
              <th className="px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="align-top">
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-950">{user.displayName}</p>
                  <p className="text-xs text-slate-500">{user.username}</p>
                </td>
                <td className="px-4 py-3 text-slate-600">{user.role}</td>
                <td className="px-4 py-3 text-slate-600">{user.watermark}</td>
                <td className="px-4 py-3 text-slate-600">{user.dailyLimit}</td>
                <td className="px-4 py-3 text-slate-600">{user.modelProvider} / {user.modelName}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${user.enabled ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {user.enabled ? "启用" : "停用"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant="secondary" onClick={() => onEdit?.(user)}>
                      编辑
                    </Button>
                    <Button type="button" size="sm" variant="secondary" onClick={() => toggleUser(user)}>
                      {user.enabled ? "停用" : "启用"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
