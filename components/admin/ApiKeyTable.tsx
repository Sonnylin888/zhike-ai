"use client";

import { Button } from "@/components/ui/button";
import { getApiKeys, maskApiKey, saveApiKeys, type ApiKeyConfig } from "@/lib/apiKeyManager";

type ApiKeyTableProps = {
  apiKeys: ApiKeyConfig[];
  onEdit?: (apiKey: ApiKeyConfig) => void;
  onChanged?: () => void;
};

export function ApiKeyTable({ apiKeys, onEdit, onChanged }: ApiKeyTableProps) {
  function toggle(apiKey: ApiKeyConfig) {
    saveApiKeys(getApiKeys().map((item) => (item.id === apiKey.id ? { ...item, enabled: !item.enabled } : item)));
    onChanged?.();
  }

  return (
    <div className="overflow-hidden rounded-lg border border-cyan-900/10 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-4">
        <h2 className="font-semibold text-slate-950">API Key 管理</h2>
        <p className="text-sm text-slate-500">列表只展示脱敏 Key，避免现场演示时泄露完整密钥。</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="px-4 py-3">名称</th>
              <th className="px-4 py-3">Provider</th>
              <th className="px-4 py-3">Model</th>
              <th className="px-4 py-3">Key</th>
              <th className="px-4 py-3">状态</th>
              <th className="px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {apiKeys.map((apiKey) => (
              <tr key={apiKey.id}>
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-950">{apiKey.name}</p>
                  <p className="text-xs text-slate-500">{apiKey.id}</p>
                </td>
                <td className="px-4 py-3 text-slate-600">{apiKey.provider}</td>
                <td className="px-4 py-3 text-slate-600">{apiKey.model}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-600">{maskApiKey(apiKey.apiKey)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${apiKey.enabled ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {apiKey.enabled ? "启用" : "停用"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant="secondary" onClick={() => onEdit?.(apiKey)}>
                      编辑
                    </Button>
                    <Button type="button" size="sm" variant="secondary" onClick={() => toggle(apiKey)}>
                      {apiKey.enabled ? "停用" : "启用"}
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
