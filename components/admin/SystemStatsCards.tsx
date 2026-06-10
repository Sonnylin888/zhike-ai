"use client";

import { getApiKeys } from "@/lib/apiKeyManager";
import { getModels } from "@/lib/modelConfig";
import { getUsageRecords } from "@/lib/usageLimiter";
import { getUsers } from "@/lib/auth";

export function SystemStatsCards() {
  const users = getUsers();
  const models = getModels();
  const apiKeys = getApiKeys();
  const usage = getUsageRecords();
  const cards = [
    { label: "账号数量", value: users.length },
    { label: "启用账号", value: users.filter((user) => user.enabled).length },
    { label: "今日生成次数", value: usage.reduce((sum, item) => sum + item.used, 0) },
    { label: "模型数量", value: models.length },
    { label: "API Key 数量", value: apiKeys.length }
  ];
  return (
    <div className="grid gap-3 md:grid-cols-5">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">{card.label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
