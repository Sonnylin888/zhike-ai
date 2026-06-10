"use client";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { UsageTable } from "@/components/admin/UsageTable";

export default function AdminUsagePage() {
  return (
    <AdminLayout title="使用统计" description="查看各账号今日 AI 生成次数和历史本地记录。">
      <UsageTable />
    </AdminLayout>
  );
}
