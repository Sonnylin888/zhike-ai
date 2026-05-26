"use client";

import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { logError, logInfo } from "@/lib/localLogs";
import { runStartupHealthCheck, type StartupHealthItem } from "@/lib/startupHealth";

export function StartupHealthCheck() {
  const [items, setItems] = useState<StartupHealthItem[]>([]);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function check() {
      setChecking(true);
      try {
        const result = await runStartupHealthCheck();
        setItems(result);
        await logInfo("Startup health check finished", {
          ready: result.filter((item) => item.status === "ready").length
        });
      } catch (error) {
        await logError("Startup health check failed", {
          message: error instanceof Error ? error.message : "unknown"
        });
      } finally {
        setChecking(false);
      }
    }

    check();
  }, []);

  return (
    <section className="rounded-lg border border-cyan-900/10 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
            Startup Health Check
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">启动前自检</h2>
        </div>
        {checking ? (
          <Loader2 className="h-5 w-5 animate-spin text-cyan-600" />
        ) : (
          <CheckCircle2 className="h-5 w-5 text-cyan-600" />
        )}
      </div>
      <div className="grid gap-3 md:grid-cols-5">
        {items.map((item) => (
          <div key={item.label} className="rounded-md bg-slate-50 px-3 py-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-slate-700">{item.label}</span>
              {item.status === "ready" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : (
                <TriangleAlert className="h-4 w-4 text-amber-600" />
              )}
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">{item.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
