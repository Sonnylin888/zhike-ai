"use client";

import { Button } from "@/components/ui/button";
import { getModels, saveModels, type ModelConfig } from "@/lib/modelConfig";

type ModelConfigTableProps = {
  models: ModelConfig[];
  onEdit?: (model: ModelConfig) => void;
  onChanged?: () => void;
};

export function ModelConfigTable({ models, onEdit, onChanged }: ModelConfigTableProps) {
  function toggle(model: ModelConfig) {
    saveModels(getModels().map((item) => (item.id === model.id ? { ...item, enabled: !item.enabled } : item)));
    onChanged?.();
  }

  return (
    <div className="overflow-hidden rounded-lg border border-cyan-900/10 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-4">
        <h2 className="font-semibold text-slate-950">模型配置</h2>
        <p className="text-sm text-slate-500">经销商账号可绑定不同模型配置，第一版用于演示和前端配置管理。</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="px-4 py-3">名称</th>
              <th className="px-4 py-3">Provider</th>
              <th className="px-4 py-3">Base URL</th>
              <th className="px-4 py-3">Model</th>
              <th className="px-4 py-3">状态</th>
              <th className="px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {models.map((model) => (
              <tr key={model.id}>
                <td className="px-4 py-3 font-semibold text-slate-950">{model.name}</td>
                <td className="px-4 py-3 text-slate-600">{model.provider}</td>
                <td className="px-4 py-3 text-slate-600">{model.baseUrl}</td>
                <td className="px-4 py-3 text-slate-600">{model.model}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${model.enabled ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {model.enabled ? "启用" : "停用"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant="secondary" onClick={() => onEdit?.(model)}>
                      编辑
                    </Button>
                    <Button type="button" size="sm" variant="secondary" onClick={() => toggle(model)}>
                      {model.enabled ? "停用" : "启用"}
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
