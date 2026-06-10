"use client";

import { Gauge } from "lucide-react";
import type { ZhikeUser } from "@/lib/auth";
import { getRemainingUsage, getUsageForUser } from "@/lib/usageLimiter";

export function UsageBadge({ user }: { user: ZhikeUser }) {
  const usage = getUsageForUser(user);
  return (
    <span className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-3 py-1.5 text-sm font-semibold text-cyan-50">
      <Gauge className="h-4 w-4 text-cyan-200" />
      今日剩余：{getRemainingUsage(user)} / {usage.limit}
    </span>
  );
}
