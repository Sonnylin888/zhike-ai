"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveApiKey, type ApiKeyConfig } from "@/lib/apiKeyManager";

const emptyApiKey: ApiKeyConfig = {
  id: "",
  provider: "deepseek",
  name: "",
  apiKey: "",
  baseUrl: "https://api.deepseek.com",
  model: "deepseek-chat",
  enabled: true
};

type ApiKeyFormProps = {
  editingApiKey?: ApiKeyConfig | null;
  onSaved?: () => void;
};

export function ApiKeyForm({ editingApiKey, onSaved }: ApiKeyFormProps) {
  const [apiKey, setApiKey] = useState<ApiKeyConfig>(emptyApiKey);

  useEffect(() => {
    setApiKey(editingApiKey || emptyApiKey);
  }, [editingApiKey]);

  function update<K extends keyof ApiKeyConfig>(key: K, value: ApiKeyConfig[K]) {
    setApiKey((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = apiKey.id.trim() || `${apiKey.provider}_${Date.now()}`;
    if (!id || !apiKey.provider.trim()) return;
    saveApiKey({
      ...apiKey,
      id,
      name: apiKey.name.trim() || id,
      provider: apiKey.provider.trim(),
      baseUrl: apiKey.baseUrl.trim() || "https://api.deepseek.com",
      model: apiKey.model.trim() || "deepseek-chat",
      apiKey: apiKey.apiKey.trim()
    });
    setApiKey(emptyApiKey);
    onSaved?.();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-cyan-900/10 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">{editingApiKey ? "编辑 API Key" : "新增 API Key"}</h2>
          <p className="text-sm text-slate-500">仅用于本地演示配置。生产环境仍建议使用服务端环境变量。</p>
        </div>
        <Button type="submit">{editingApiKey ? "保存修改" : "保存 Key"}</Button>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-5">
        <div className="space-y-2">
          <Label htmlFor="key-id">Key ID</Label>
          <Input id="key-id" value={apiKey.id} onChange={(event) => update("id", event.target.value)} placeholder="deepseek_hebei" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="key-name">名称</Label>
          <Input id="key-name" value={apiKey.name} onChange={(event) => update("name", event.target.value)} placeholder="河北演示Key" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="key-provider">Provider</Label>
          <Input id="key-provider" value={apiKey.provider} onChange={(event) => update("provider", event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="key-model">Model</Label>
          <Input id="key-model" value={apiKey.model} onChange={(event) => update("model", event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="key-value">API Key</Label>
          <Input id="key-value" value={apiKey.apiKey} onChange={(event) => update("apiKey", event.target.value)} placeholder="sk-..." />
        </div>
      </div>
      <label className="mt-4 flex items-center gap-2 text-sm text-slate-600">
        <input type="checkbox" checked={apiKey.enabled} onChange={(event) => update("enabled", event.target.checked)} />
        启用 API Key
      </label>
    </form>
  );
}
