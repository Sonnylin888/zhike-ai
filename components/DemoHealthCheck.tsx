"use client";

import { Activity, AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getDemoHealth } from "@/lib/demoHealth";
import type { TeachingPlan } from "@/lib/prompt";

type Props = {
  plan: TeachingPlan | null;
  source: string;
  activeTemplateLabel?: string;
};

export function DemoHealthCheck({ plan, source, activeTemplateLabel }: Props) {
  const [fullscreenSupported, setFullscreenSupported] = useState(false);

  useEffect(() => {
    setFullscreenSupported(Boolean(document.documentElement.requestFullscreen));
  }, []);

  const items = useMemo(
    () =>
      getDemoHealth({
        plan,
        source,
        activeTemplateLabel,
        fullscreenSupported
      }),
    [activeTemplateLabel, fullscreenSupported, plan, source]
  );

  const usesFallback =
    source === "demo-fallback" ||
    source === "ai-fallback" ||
    source === "fixed-demo" ||
    !source;

  return (
    <section className="rounded-lg border border-cyan-900/10 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
            Demo Health Check
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">演示稳定性面板</h2>
        </div>
        <div className="flex items-center gap-2 rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-cyan-50">
          <Activity className="h-4 w-4 text-cyan-200" />
          试讲可继续
        </div>
      </div>
      {usesFallback ? (
        <p className="mb-4 rounded-md border border-cyan-100 bg-cyan-50 px-3 py-2 text-sm font-medium text-cyan-800">
          当前使用本地 Demo 数据，仍可继续演示。
        </p>
      ) : null}
      <div className="grid gap-3 md:grid-cols-5">
        {items.map((item) => (
          <div key={item.label} className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-500">{item.label}</span>
              {item.status === "ready" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : item.status === "fallback" ? (
                <CheckCircle2 className="h-4 w-4 text-cyan-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-600" />
              )}
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-950">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
