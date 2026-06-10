"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveUser, type UserRole, type ZhikeUser } from "@/lib/auth";

const emptyUser: ZhikeUser = {
  id: "",
  username: "",
  password: "123456",
  role: "agent",
  displayName: "",
  watermark: "",
  dailyLimit: 20,
  modelProvider: "deepseek",
  modelName: "deepseek-chat",
  apiKeyId: "deepseek_default",
  enabled: true
};

type UserFormProps = {
  editingUser?: ZhikeUser | null;
  onSaved?: () => void;
};

export function UserForm({ editingUser, onSaved }: UserFormProps) {
  const [user, setUser] = useState<ZhikeUser>(emptyUser);

  useEffect(() => {
    setUser(editingUser || emptyUser);
  }, [editingUser]);

  function update<K extends keyof ZhikeUser>(key: K, value: ZhikeUser[K]) {
    setUser((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = user.id.trim() || user.username.trim();
    if (!id || !user.username.trim()) return;
    saveUser({
      ...user,
      id,
      username: user.username.trim(),
      displayName: user.displayName.trim() || user.username.trim(),
      watermark: user.watermark.trim() || "智课AI演示版",
      dailyLimit: Number(user.dailyLimit) || 0
    });
    setUser(emptyUser);
    onSaved?.();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-cyan-900/10 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            {editingUser ? "编辑账号" : "新增账号"}
          </h2>
          <p className="text-sm text-slate-500">账号数据保存在当前浏览器 localStorage。</p>
        </div>
        <Button type="submit">{editingUser ? "保存修改" : "创建账号"}</Button>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="user-id">账号 ID</Label>
          <Input id="user-id" value={user.id} onChange={(event) => update("id", event.target.value)} placeholder="hebei" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">登录账号</Label>
          <Input id="username" value={user.username} onChange={(event) => update("username", event.target.value)} placeholder="hebei" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">密码</Label>
          <Input id="password" value={user.password} onChange={(event) => update("password", event.target.value)} placeholder="123456" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">角色</Label>
          <select
            id="role"
            value={user.role}
            onChange={(event) => update("role", event.target.value as UserRole)}
            className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
          >
            <option value="admin">admin</option>
            <option value="agent">agent</option>
            <option value="school">school</option>
            <option value="demo">demo</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="display-name">显示名称</Label>
          <Input id="display-name" value={user.displayName} onChange={(event) => update("displayName", event.target.value)} placeholder="河北经销商" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="watermark">水印</Label>
          <Input id="watermark" value={user.watermark} onChange={(event) => update("watermark", event.target.value)} placeholder="河北经销商演示版" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="daily-limit">每日 AI 次数</Label>
          <Input id="daily-limit" type="number" min={0} value={user.dailyLimit} onChange={(event) => update("dailyLimit", Number(event.target.value))} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="api-key-id">API Key ID</Label>
          <Input id="api-key-id" value={user.apiKeyId} onChange={(event) => update("apiKeyId", event.target.value)} />
        </div>
      </div>
      <label className="mt-4 flex items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={user.enabled}
          onChange={(event) => update("enabled", event.target.checked)}
        />
        启用账号
      </label>
    </form>
  );
}
