"use client";

import { Cloud, CloudOff, ServerCrash } from "lucide-react";
import { useEffect, useState } from "react";
import { detectNetworkStatus, type NetworkStatus } from "@/lib/networkStatus";
import { logInfo, logWarn } from "@/lib/localLogs";

export function NetworkStatusBadge() {
  const [status, setStatus] = useState<NetworkStatus | null>(null);

  useEffect(() => {
    async function refresh() {
      const nextStatus = await detectNetworkStatus();
      setStatus(nextStatus);
      if (nextStatus.aiAvailable) {
        await logInfo("AI service available");
      } else {
        await logWarn("AI service unavailable, demo fallback enabled", {
          mode: nextStatus.mode
        });
      }
    }

    refresh();
    window.addEventListener("online", refresh);
    window.addEventListener("offline", refresh);
    const timer = window.setInterval(refresh, 30000);
    return () => {
      window.removeEventListener("online", refresh);
      window.removeEventListener("offline", refresh);
      window.clearInterval(timer);
    };
  }, []);

  const mode = status?.mode || "offline";
  const Icon = mode === "online" ? Cloud : mode === "offline" ? CloudOff : ServerCrash;
  const label =
    mode === "online" ? "在线" : mode === "offline" ? "离线" : "AI 服务异常";
  const className =
    mode === "online"
      ? "bg-emerald-50 text-emerald-700"
      : mode === "offline"
        ? "bg-amber-50 text-amber-700"
        : "bg-cyan-50 text-cyan-700";

  return (
    <span className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold ${className}`}>
      <Icon className="h-4 w-4" />
      {label} · Demo 模式可用
    </span>
  );
}
