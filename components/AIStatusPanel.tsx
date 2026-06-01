"use client";

import { Bot, CheckCircle2, RefreshCw, ShieldCheck, TriangleAlert } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type AIHealth = {
  aiConfigured: boolean;
  model: string;
  baseURL: string;
  mockMode: boolean;
  connectionStatus: string;
  latestRequest: {
    state: "idle" | "success" | "mock" | "error";
    message: string;
    updatedAt: string | null;
  };
};

export function AIStatusPanel() {
  const [health, setHealth] = useState<AIHealth | null>(null);
  const [checking, setChecking] = useState(false);

  const refresh = useCallback(async () => {
    setChecking(true);
    try {
      const response = await fetch("/api/health", { cache: "no-store" });
      if (!response.ok) throw new Error("health check failed");
      setHealth((await response.json()) as AIHealth);
    } catch {
      setHealth(null);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const configured = health?.aiConfigured ?? false;
  const statusOk = health?.latestRequest.state === "success";
  const statusText = health?.connectionStatus || "检测中";

  return (
    <section className="rounded-lg border border-cyan-900/10 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
            AI Service
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">DeepSeek AI 状态</h2>
        </div>
        <button
          type="button"
          onClick={refresh}
          disabled={checking}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:border-cyan-500 hover:text-cyan-700 disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${checking ? "animate-spin" : ""}`} />
          刷新状态
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <StatusItem label="当前模型" value={health?.model || "deepseek-v4-flash"} icon={Bot} />
        <StatusItem label="Base URL" value={health?.baseURL || "https://api.deepseek.com"} icon={ShieldCheck} />
        <StatusItem
          label="API Key"
          value={configured ? "已配置" : "未配置，将使用 Demo"}
          icon={configured ? CheckCircle2 : TriangleAlert}
        />
        <StatusItem
          label="DeepSeek 连接"
          value={statusText}
          icon={statusOk ? CheckCircle2 : TriangleAlert}
        />
        <StatusItem
          label="Mock Mode"
          value={health?.mockMode ? "已启用" : "未启用"}
          icon={health?.mockMode ? TriangleAlert : CheckCircle2}
        />
        <StatusItem
          label="最近一次请求"
          value={health?.latestRequest.message || "尚未发起 AI 请求"}
          icon={statusOk ? CheckCircle2 : Bot}
        />
      </div>
    </section>
  );
}

function StatusItem({
  label,
  value,
  icon: Icon
}: {
  label: string;
  value: string;
  icon: typeof Bot;
}) {
  return (
    <div className="rounded-md bg-slate-50 px-3 py-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Icon className="h-4 w-4 text-cyan-700" />
        {label}
      </div>
      <p className="mt-2 break-words text-xs leading-5 text-slate-500">{value}</p>
    </div>
  );
}
