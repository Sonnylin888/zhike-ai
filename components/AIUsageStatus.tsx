"use client";

import { Gauge, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import {
  agencyUsageChangedEvent,
  readAgencySession,
  readDailyUsage,
  type AgencySession,
  type DailyUsage
} from "@/lib/agencyUsage";

export function AIUsageStatus() {
  const [session, setSession] = useState<AgencySession | null>(null);
  const [usage, setUsage] = useState<DailyUsage | null>(null);

  useEffect(() => {
    function refresh() {
      const nextSession = readAgencySession();
      setSession(nextSession);
      setUsage(nextSession ? readDailyUsage(nextSession.userId) : null);
    }

    refresh();
    window.addEventListener(agencyUsageChangedEvent, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(agencyUsageChangedEvent, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return (
    <div className="sticky top-0 z-40 border-b border-cyan-900/10 bg-white/86 px-4 py-3 backdrop-blur md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 font-semibold text-slate-950">
          <ShieldCheck className="h-4 w-4 text-cyan-600" />
          代理商体验模式
        </div>
        <div className="flex flex-wrap items-center gap-3 text-slate-600">
          <span>
            {session ? `当前账号：${session.userId}` : "请登录代理商测试账号"}
          </span>
          <span className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-3 py-1.5 font-semibold text-cyan-50">
            <Gauge className="h-4 w-4 text-cyan-200" />
            今日 AI 剩余次数：{usage ? usage.remainingToday : 0} / {usage ? usage.dailyLimit : 20}
          </span>
        </div>
      </div>
    </div>
  );
}
