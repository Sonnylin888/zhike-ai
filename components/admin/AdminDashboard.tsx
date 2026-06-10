"use client";

import { RecentUsagePanel } from "@/components/admin/RecentUsagePanel";
import { SystemStatsCards } from "@/components/admin/SystemStatsCards";

export function AdminDashboard() {
  return (
    <div className="space-y-5">
      <SystemStatsCards />
      <RecentUsagePanel />
    </div>
  );
}
