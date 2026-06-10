"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveModel, type ModelConfig } from "@/lib/modelConfig";

const emptyModel: ModelConfig = {
  id: "",
  provider: "deepseek",
  name: "",
  baseUrl: "https://api.deepseek.com",
  model: "deepseek-chat",
  enabled: true
};

type ModelConfigFormProps = {
  editingModel?: ModelConfig | null;
  onSaved?: () => void;
};

export function ModelConfigForm({ editingModel, onSaved }: ModelConfigFormProps) {
  const [model, setModel] = useState<ModelConfig>(emptyModel);

  useEffect(() => {
    setModel(editingModel || emptyModel);
  }, [editingModel]);

  function update<K extends keyof ModelConfig>(key: K, value: ModelConfig[K]) {
    setModel((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = model.id.trim() || `${model.provider}_${model.model}`;
    if (!id || !model.model.trim()) return;
    saveModel({
      ...model,
      id,
      name: model.name.trim() || model.model,
      provider: model.provider.trim() || "deepseek",
      baseUrl: model.baseUrl.trim() || "https://api.deepseek.com",
      model: model.model.trim()
    });
    setModel(emptyModel);
    onSaved?.();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-cyan-900/10 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">{editingModel ? "编辑模型" : "新增模型"}</h2>
          <p className="text-sm text-slate-500">用于账号绑定与后台展示，实际服务端 Key 仍由环境变量保护。</p>
        </div>
        <Button type="submit">{editingModel ? "保存修改" : "保存模型"}</Button>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-5">
        <div className="space-y-2">
          <Label htmlFor="model-id">ID</Label>
          <Input id="model-id" value={model.id} onChange={(event) => update("id", event.target.value)} placeholder="deepseek-chat" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="provider">Provider</Label>
          <Input id="provider" value={model.provider} onChange={(event) => update("provider", event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model-name">展示名称</Label>
          <Input id="model-name" value={model.name} onChange={(event) => update("name", event.target.value)} placeholder="DeepSeek Chat" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="base-url">Base URL</Label>
          <Input id="base-url" value={model.baseUrl} onChange={(event) => update("baseUrl", event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model-value">Model</Label>
          <Input id="model-value" value={model.model} onChange={(event) => update("model", event.target.value)} />
        </div>
      </div>
      <label className="mt-4 flex items-center gap-2 text-sm text-slate-600">
        <input type="checkbox" checked={model.enabled} onChange={(event) => update("enabled", event.target.checked)} />
        启用模型
      </label>
    </form>
  );
}
