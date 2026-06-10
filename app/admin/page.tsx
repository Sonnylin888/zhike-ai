"use client";

import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminPage() {
  return (
    <AdminLayout title="系统概览" description="查看账号、模型、API Key 与今日 AI 使用情况。">
      <AdminDashboard />
    </AdminLayout>
  );
}
